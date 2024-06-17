import MillionLint from "@million/lint";
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbo: {},
    },
};
export default MillionLint.next({
    rsc: true,
})(nextConfig);
