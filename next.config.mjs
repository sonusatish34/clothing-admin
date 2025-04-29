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
          hostname: 'ldcars.blr1.digitaloceanspaces.com',
        },
        {
          protocol: 'https',
          hostname: 'miro.medium.com',
        },
        {
          protocol: 'https',
          hostname: 'longdrivecarsnew-lime.vercel.app',
        },
        {
          protocol: 'http',
          hostname: 'ldcars.blr1.digitaloceanspaces.com',
        },
      ],
    },
  };
  
  export default nextConfig;
  
