// Server-side metrics helper for the dashboard app. Sends custom metrics and
// creates monitors through the official Datadog API client. Keys come from
// the environment (DD_API_KEY / DD_APP_KEY are set in the hosting dashboard).
import { client, v1, v2 } from "@datadog/datadog-api-client";

const DD_SITE = process.env.DD_SITE ?? "datadoghq.com";
const DD_API_KEY = process.env.DD_API_KEY;
const DD_APP_KEY = process.env.DD_APP_KEY;

if (!DD_API_KEY || !DD_APP_KEY) {
  throw new Error("DD_API_KEY and DD_APP_KEY must be set");
}

const configuration = client.createConfiguration({
  authMethods: {
    apiKeyAuth: DD_API_KEY,
    appKeyAuth: DD_APP_KEY,
  },
});
configuration.setServerVariables({ site: DD_SITE });

const metricsApi = new v2.MetricsApi(configuration);
const monitorsApi = new v1.MonitorsApi(configuration);

export async function trackSignup(plan: string) {
  await metricsApi.submitMetrics({
    body: {
      series: [
        {
          metric: "app.signups",
          type: 1,
          points: [{ timestamp: Math.floor(Date.now() / 1000), value: 1 }],
          tags: [`plan:${plan}`],
        },
      ],
    },
  });
}

export async function ensureErrorRateMonitor() {
  return monitorsApi.createMonitor({
    body: {
      name: "API error rate high",
      type: "query alert",
      query: "avg(last_5m):sum:app.errors{*}.as_rate() > 5",
      message: "Error rate is above threshold @slack-alerts",
    },
  });
}
