"""Apply database migrations before a deploy. Run from the CI deploy job.

Alembic reads the connection URL, password included, from DATABASE_URL in its
environment, so the password never appears on the command line.
"""
import os
import subprocess

DB_HOST = os.environ["DB_HOST"]
DB_USER = os.environ["DB_USER"]
DB_PASSWORD = os.environ["DB_PASSWORD"]
DB_NAME = os.environ["DB_NAME"]


def main():
    subprocess.run(
        ["alembic", "upgrade", "head"],
        env={**os.environ, "DATABASE_URL": f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"},
        check=True,
    )
    print("Migrations applied")


if __name__ == "__main__":
    main()
