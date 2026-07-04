import subprocess
from flask import request

def run():
    name = request.args.get("name")
    # Argument vector, shell=False — no shell interpretation. VC094 must NOT fire.
    subprocess.run(["/usr/local/bin/backup.sh", name], shell=False, check=True)
