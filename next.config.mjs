import withSerwistInit from "@serwist/next";
import MillionLint from "@million/lint";
/** @type {import('next').NextConfig} */

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});

const nextConfig = {
    experimental: {
        turbo: {},
    },
};

export default MillionLint.next({
    rsc: true,
})(withSerwist(nextConfig));
