// Sample project config with a hardcoded AWS access key.
// This should trigger VC001 (Hardcoded API Key or Secret).

const AWS_CONFIG = {
  region: "us-east-1",
  accessKeyId: "AKIAIOSFODNN7EXAMPLE",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
};

export function getS3Client() {
  return new S3Client(AWS_CONFIG);
}
