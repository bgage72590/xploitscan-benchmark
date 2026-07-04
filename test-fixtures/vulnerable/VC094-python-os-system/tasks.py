import os
from flask import request

def run_backup():
    target = request.args.get("target")
    # User input interpolated straight into a shell command (VC094).
    os.system(f"/usr/local/bin/backup.sh {target}")
