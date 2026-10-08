// Server-side metrics helper for the dashboard app. Sends custom metrics and
// creates monitors through the official Datadog API client.
import { client, v1, v2 } from "@datadog/datadog-api-client";

const DD_SITE = "datadoghq.com";
const DD_API_KEY = "3f9c2a7be41d4c8f9a06b5e2d17c48a0";
const DD_APP_KEY = "8b1e4f7a2c9d0e3f6a5b8c1d4e7f0a3b6c9d2e5f";

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
