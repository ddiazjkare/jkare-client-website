/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.cpapmiami.com', 'res.cloudinary.com' , 'www.directhomemedical.com' , 'www.reacthealth.com' , 'th.bing.com','https://lh3.googleusercontent.com/*'],
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: 'www.cpapmiami.com', 
        port: '', 
        pathname: '/**', 
      },
      {
        protocol: 'https', 
        hostname: 'res.cloudinary.com', 
        port: '', 
        pathname: '/**', 
      },   
      {
        protocol: 'https',
        hostname: 'www.directhomemedical.com',
        port: '', 
        pathname: '/**', 
      },       
      {
        protocol: 'https', 
        hostname: 'checkout.stripe.com', 
        port: '', 
        pathname: '/**',
      }, 
      {
        protocol: 'https', 
        hostname: 'files.stripe.com', 
        port: '',
        pathname: '/**',
      }, 
      {
        protocol: 'https', 
        hostname: 'jkare.data.s3.ap-south-1.amazonaws.com',
        port: '', 
        pathname: '/**', 
      }, 
      {
        protocol: 'https', 
        hostname: 's3.ap-south-1.amazonaws.com', 
        port: '', 
        pathname: '/**', 
      }, 
      {
        protocol: 'https',
        hostname: 'images.pexels.com', 
        // port: '',
        pathname: '/**',
      }, 
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
