// Deploy helper that shells out to the Fly.io Machines API with a committed
// org-scoped deploy token. This should trigger VC172 (Hardcoded Fly.io Auth Token).

const FLY_API = "https://api.machines.dev/v1";

const FLY_AUTH = "FlyV1 fm2_FAKE0000FAKE0000FAKE0000FAKE0000FAKE0000FAKE0000FAKE0000";

export async function restartMachine(appName: string, machineId: string) {
  const res = await fetch(`${FLY_API}/apps/${appName}/machines/${machineId}/restart`, {
    method: "POST",
    headers: {
      Authorization: FLY_AUTH,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Fly restart failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}
