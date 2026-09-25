import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The desktop used to be the page at `/`, and `?app=` named the window to
     open, so links shared before it moved look like `/?app=experience`. They
     still open that window: the query carries through to /desktop.

     A redirect rather than a check in page.tsx, because reading searchParams
     there would stop `/` from being prerendered. */
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "query", key: "app" }],
        destination: "/desktop",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
