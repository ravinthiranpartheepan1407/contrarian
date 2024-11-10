import webpack from 'webpack';
import dotenv from 'dotenv';
import { NextConfig } from 'next';

// Load environment variables
dotenv.config();

const nextConfig: NextConfig = {
    reactStrictMode: true,
    webpack(config, { isServer }: { isServer: boolean }) {
        // This allows you to use your environment variables in both the client and server
        config.plugins.push(
            new webpack.EnvironmentPlugin(process.env)
        );

        // Additional customization for Webpack can go here if necessary
        return config;
    },
};

export default nextConfig;
