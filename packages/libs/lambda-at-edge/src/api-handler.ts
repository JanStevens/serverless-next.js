// @ts-ignore
import manifest from "./manifest.json";
// @ts-ignore
import RoutesManifestJson from "./routes-manifest.json";
import cloudFrontCompat from "@sls-next/next-aws-cloudfront";
import {
  OriginRequestApiHandlerManifest,
  OriginRequestEvent,
  RoutesManifest
} from "./types";
import { CloudFrontResultResponse } from "aws-lambda";
import { createExternalRewriteResponse } from "./routing/rewriter";
import { handleApi } from "@sls-next/core/dist/module/handle/api";
import { removeBlacklistedHeaders } from "./headers/removeBlacklistedHeaders";
import { triggerStaticRegeneration } from "./lib/triggerStaticRegeneration";
import { s3BucketNameFromEventRequest } from "./s3/s3BucketNameFromEventRequest";
import { routeDefault } from "@sls-next/core/dist/module/route";
import { PrerenderManifest, StaticRoute } from "@sls-next/core";

const routesManifest: RoutesManifest = RoutesManifestJson;
const buildManifest: OriginRequestApiHandlerManifest = manifest;

// Makes it easier to call routeDefault
const FakePreviewManifest: PrerenderManifest = {
  preview: {
    previewModeId: "not-used",
    previewModeEncryptionKey: "not-used",
    previewModeSigningKey: "not-used"
  }
};

const revalidate = async (
  path: string,
  request: AWSLambda.CloudFrontRequest
) => {
  // Set the URI explicitly so we can determine the path using existing helpers
  request.uri = path;
  request.querystring = "";

  const route = await routeDefault(
    request,
    manifest,
    FakePreviewManifest,
    routesManifest
  );
  const staticRoute = route.isStatic ? (route as StaticRoute) : undefined;
  const bucketName = s3BucketNameFromEventRequest(request);

  if (staticRoute?.page) {
    const options = {
      request,
      basePath: routesManifest.basePath,
      // Can be configured but this is not documented at all so always use the fallback
      queueName: `${bucketName}.fifo`,
      pagePath: staticRoute.page, // should be the js file to the page
      pageS3Path: path, // should be the path to the s3 file
      eTag: undefined,
      lastModified: undefined
    };

    try {
      await triggerStaticRegeneration(options);
    } catch (error) {
      console.error(error);
    }
  }
};

export const handler = async (
  event: OriginRequestEvent
): Promise<CloudFrontResultResponse> => {
  const request = event.Records[0].cf.request;
  const { req, res, responsePromise } = cloudFrontCompat(event.Records[0].cf, {
    enableHTTPCompression: buildManifest.enableHTTPCompression
  });

  const external = await handleApi(
    { req, res, responsePromise },
    buildManifest,
    routesManifest,
    (pagePath: string) => require(`./${pagePath}`),
    (path) => revalidate(path, request)
  );

  if (external) {
    const { path } = external;
    await createExternalRewriteResponse(path, req, res, request.body?.data);
  }

  const response = await responsePromise;

  if (response.headers) {
    removeBlacklistedHeaders(response.headers);
  }

  return response;
};
