// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// export default nextConfig;
  /** @type {import('next').NextConfig} */
  const nextConfig = {
  
    reactStrictMode: true,

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ldcars.blr1.cdn.digitaloceanspaces.com',
        },
        {
          protocol: 'https',
          hostname: 'st3.depositphotos.com',
        },
        {
          protocol: 'https',
          hostname: 'assets.bwbx.io',
        },
        {
          protocol: 'https',
          hostname: 'longdrivecarsnew-lime.vercel.app',
        },
        {
          protocol: 'http',
          hostname: 'ldcars.blr1.digitaloceanspaces.com',
        },
        {
          protocol: 'https',
          hostname: 'cdn.longdrivecars.com',
        },
        {
          protocol: 'https',
          hostname: 'cdn.zuget.com',
        },
      ],
    },
  };
  
  export default nextConfig;
  
