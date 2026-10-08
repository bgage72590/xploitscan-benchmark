import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const hasS3Credentials = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
console.log("S3 credentials configured:", hasS3Credentials);

// Lists every upload under a user's prefix, one 1,000-key page at a time.
export async function listUserUploads(userId: string): Promise<string[]> {
  const keys: string[] = [];
  let ContinuationToken: string | undefined;
  do {
    const out = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.UPLOADS_BUCKET!,
        Prefix: `users/${userId}/`,
        ContinuationToken,
      }),
    );
    keys.push(...(out.Contents ?? []).map((o) => o.Key!));
    console.log("Listed", out.KeyCount, "objects; next:", out.NextContinuationToken);
    ContinuationToken = out.NextContinuationToken;
  } while (ContinuationToken);
  return keys;
}
