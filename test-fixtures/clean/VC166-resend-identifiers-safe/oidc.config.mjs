// oidc-provider configuration for the app's login server. Client metadata
// uses the RFC 7591 / RFC 9126 names, which are long snake_case keys.
// VC166 must NOT fire.
export default {
  features: {
    pushedAuthorizationRequests: { enabled: true },
    devInteractions: { enabled: false },
  },
  clientDefaults: {
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    require_pushed_authorization_requests: true,
  },
  ttl: {
    AccessToken: 3600,
    RefreshToken: 14 * 24 * 3600,
  },
};
