"""Deploy the latest build to the production box over SSH."""
import os
import sys

import paramiko

DEPLOY_HOST = os.environ["DEPLOY_HOST"]
DEPLOY_USER = os.environ.get("DEPLOY_USER", "ubuntu")
KEY_PATH = os.path.expanduser(os.environ.get("DEPLOY_KEY_PATH", "~/.ssh/id_ed25519"))

COMMANDS = [
    "cd /srv/app && git pull origin main",
    "cd /srv/app && npm ci --omit=dev",
    "sudo systemctl restart app",
]


def deploy() -> int:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(DEPLOY_HOST, username=DEPLOY_USER, key_filename=KEY_PATH, timeout=15)

    try:
        for cmd in COMMANDS:
            print(f"$ {cmd}")
            _, stdout, stderr = client.exec_command(cmd)
            exit_code = stdout.channel.recv_exit_status()
            print(stdout.read().decode())
            if exit_code != 0:
                print(stderr.read().decode(), file=sys.stderr)
                return exit_code
    finally:
        client.close()
    return 0


if __name__ == "__main__":
    sys.exit(deploy())
