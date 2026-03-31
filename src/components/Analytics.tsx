import Script from "next/script";

export default function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID;
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;

  return (
    <>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
      {umamiId && umamiUrl && (
        <Script
          defer
          src={`${umamiUrl}/script.js`}
          data-website-id={umamiId}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
