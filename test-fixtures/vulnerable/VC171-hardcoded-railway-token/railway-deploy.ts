// Railway deployment helper used by the release pipeline. The project API
// token is baked into the config object instead of injected at runtime.
// This should trigger VC171 (Hardcoded Railway API Token).

const railwayConfig = {
  projectId: "0a1b2c3d-1111-4000-8000-222233334444",
  environmentId: "5566aabb-7777-4000-8000-888899990000",
  RAILWAY_API_TOKEN: "00000000-0000-4000-8000-0000deadbeef",
};

export async function triggerDeploy(serviceId: string): Promise<string> {
  const res = await fetch("https://backboard.railway.app/graphql/v2", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${railwayConfig.RAILWAY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `mutation($id: String!, $env: String!) {
        serviceInstanceDeploy(serviceId: $id, environmentId: $env)
      }`,
      variables: { id: serviceId, env: railwayConfig.environmentId },
    }),
  });

  if (!res.ok) {
    throw new Error(`Railway deploy failed: ${res.status}`);
  }
  const { data } = await res.json();
  return data.serviceInstanceDeploy;
}
