import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://7df9dd20ae7734756e3f65023fe95e60@o4511141200986112.ingest.us.sentry.io/4511141203017728",

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  tracesSampleRate: 0.1,
  enableLogs: true,

  // Don't record replays on normal sessions - only on errors
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,

  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
