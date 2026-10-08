import posixpath

from paramiko import AutoAddPolicy, SSHClient


class SFTPSync:
    """Pushes generated invoices to a customer's SFTP drop folder."""

    def __init__(self, host: str, username: str, password: str, port: int = 22):
        self.client = SSHClient()
        self.client.load_system_host_keys()
        self.client.set_missing_host_key_policy(AutoAddPolicy)
        self.client.connect(host, port=port, username=username, password=password)
        self.sftp = self.client.open_sftp()

    def upload(self, local_path: str, remote_dir: str) -> str:
        remote_path = posixpath.join(remote_dir, posixpath.basename(local_path))
        self.sftp.put(local_path, remote_path)
        return remote_path

    def close(self) -> None:
        self.sftp.close()
        self.client.close()
