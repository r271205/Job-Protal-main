// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://817f95b77906385aad675b419bb5ef27@o4510640291315712.ingest.us.sentry.io/4510640297803776",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true, 
  integrations: [Sentry.mongooseIntegration()]
});
