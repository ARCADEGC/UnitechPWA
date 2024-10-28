import withSerwistInit from "@serwist/next";
// import MillionLint from "@million/lint";

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});

const nextConfig = {
    experimental: {
        reactCompiler: true,
    },
};

// export default MillionLint.next({
//     rsc: true,
// })(withSerwist(nextConfig));

export default withSerwist(nextConfig);
