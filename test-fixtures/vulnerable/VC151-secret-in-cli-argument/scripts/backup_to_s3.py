"""Dump the Postgres database and upload it to S3. Run nightly from cron."""
import os
import subprocess
from datetime import datetime, timezone

import boto3

DB_HOST = os.environ["DB_HOST"]
DB_USER = os.environ["DB_USER"]
DB_PASSWORD = os.environ["DB_PASSWORD"]
DB_NAME = os.environ["DB_NAME"]
BUCKET = os.environ.get("BACKUP_BUCKET", "acme-db-backups")


def main():
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    outfile = f"/tmp/{DB_NAME}-{stamp}.dump"

    subprocess.run(
        ["pg_dump", "-Fc", "-f", outfile, f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:5432/{DB_NAME}"],
        check=True,
    )

    boto3.client("s3").upload_file(outfile, BUCKET, f"postgres/{os.path.basename(outfile)}")
    os.remove(outfile)
    print(f"Uploaded {outfile} to s3://{BUCKET}")


if __name__ == "__main__":
    main()
