import "server-only";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2 (S3-compatible) adapter. Server-only. Most uploads go server→R2
 * so no bucket CORS config is required; objects are read back server-side and
 * inlined as data URLs by the callers (avoids CORS / canvas taint).
 *
 * EXCEPTION: the registration avatar uses a short-lived PRESIGNED PUT URL so the
 * (up to 5 MB) photo goes browser→R2 directly instead of through the Server
 * Action body (Next caps that at 1 MB). Direct browser PUTs DO require a bucket
 * CORS policy allowing PUT from the site origin — see r2PresignPut below.
 */

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error("R2 credentials are not configured (R2_ACCOUNT_ID / _ACCESS_KEY_ID / _SECRET_ACCESS_KEY).");
    }
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}

function bucket(): string {
  const b = process.env.R2_BUCKET;
  if (!b) throw new Error("R2_BUCKET is not set.");
  return b;
}

export async function r2Put(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  await getClient().send(
    new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: contentType }),
  );
}

export async function r2Get(key: string): Promise<Buffer> {
  const res = await getClient().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
  const bytes = await res.Body!.transformToByteArray();
  return Buffer.from(bytes);
}

export async function r2Delete(key: string): Promise<void> {
  await getClient().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}

/**
 * Presigned PUT URL for a browser to upload one object DIRECTLY to R2. The
 * `contentType` is bound into the signature, so the client must send a matching
 * `Content-Type` header. Deliberately short-lived (seconds) — it authorises a
 * single upload to exactly `key` and nothing else. The bytes are re-validated
 * server-side (magic bytes + size) before they are ever attached to a user.
 *
 * REQUIRES a bucket CORS policy allowing PUT (and the OPTIONS preflight) from
 * the site origin, e.g.:
 *   [{ "AllowedOrigins": ["https://primemeghalaya.com"],
 *      "AllowedMethods": ["PUT"], "AllowedHeaders": ["content-type"],
 *      "MaxAgeSeconds": 3600 }]
 */
export async function r2PresignPut(
  key: string,
  contentType: string,
  expiresIn = 120,
): Promise<string> {
  const cmd = new PutObjectCommand({
    Bucket: bucket(),
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(getClient(), cmd, { expiresIn });
}
