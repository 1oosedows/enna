/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'covers.openlibrary.org' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/library/hackrf-one',
        destination: '/gear/hackrf-one',
        permanent: true,
      },
      {
        source: '/library/flipper-zero',
        destination: '/gear/flipper-zero',
        permanent: true,
      },
      {
        source: '/library/alfa-awus036ach',
        destination: '/gear/alfa-awus036ach',
        permanent: true,
      },
      {
        source: '/library/proxmark3',
        destination: '/gear/proxmark3',
        permanent: true,
      },
      {
        source: '/library/rtl-sdr-kit',
        destination: '/gear/rtl-sdr-kit',
        permanent: true,
      },
      {
        source: '/library/macbook-pro-2019-i9',
        destination: '/gear/macbook-pro-2019-i9',
        permanent: true,
      },
      {
        source: '/library/macbook-air-2020-m1',
        destination: '/gear/macbook-air-2020-m1',
        permanent: true,
      },
      {
        source: '/library/macbook-pro-2021-m1',
        destination: '/gear/macbook-pro-2021-m1',
        permanent: true,
      },
      {
        source: '/library/macbook-pro-2022-m2',
        destination: '/gear/macbook-pro-2022-m2',
        permanent: true,
      },
      {
        source: '/library/macbook-air-2024-m3',
        destination: '/gear/macbook-air-2024-m3',
        permanent: true,
      },
      {
        source: '/library/macbook-pro-2026-m5-max',
        destination: '/gear/macbook-pro-2026-m5-max',
        permanent: true,
      },
      {
        source: '/library/lg-gram-pro-2025',
        destination: '/gear/lg-gram-pro-2025',
        permanent: true,
      },
      {
        source: '/library/lg-gram-business-2025',
        destination: '/gear/lg-gram-business-2025',
        permanent: true,
      },
      {
        source: '/library/asus-zenbook-2026',
        destination: '/gear/asus-zenbook-2026',
        permanent: true,
      },
      {
        source: '/library/asus-vivobook-2025',
        destination: '/gear/asus-vivobook-2025',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "enna-sent",
  project: "sentry-citron-zebra",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
