/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.externals.push({
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
        canvas: "commonjs canvas",
      });
      // config.infrastructureLogging = { debug: /PackFileCache/ };
      return config;
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "liveblocks.io",
          port: "",
        },
        {
          protocol: "https",
          hostname: "t4.ftcdn.net",
          port: "",
        },
        {
          protocol: "https",
          hostname: "images.pexels.com",
          port: ""
        }
      ],
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;