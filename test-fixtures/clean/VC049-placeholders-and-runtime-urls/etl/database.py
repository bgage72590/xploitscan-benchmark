import os

from sqlalchemy import create_engine

# The URL is formatted from environment variables when the job starts.
engine = create_engine(
    "postgresql+psycopg2://%s:%s@%s/%s"
    % (
        os.environ["ETL_DB_USER"],
        os.environ["ETL_DB_PASSWORD"],
        os.environ["ETL_DB_HOST"],
        os.environ["ETL_DB_NAME"],
    ),
    pool_pre_ping=True,
)
