/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    ],
  },
};

export default nextConfig;
