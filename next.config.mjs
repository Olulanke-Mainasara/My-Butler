/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next 16 blocks image optimization from private/local IPs by default
    // (SSRF protection) even when the host matches a remotePattern below -
    // needed to load avatars/logos from the local Supabase stack
    // (127.0.0.1:54321) in dev. Never enable this in production.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "lizntcmxpepbnqbmmfvk.supabase.co",
        port: "",
        search: "",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        search: "",
      },
    ],
  },
};

export default nextConfig;
