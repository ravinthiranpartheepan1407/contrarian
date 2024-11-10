import webpack from 'webpack';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const nextConfig = {
    reactStrictMode: true,
    webpack(config, { isServer }) {
        // This allows you to use your environment variables in both the client and server
        config.plugins.push(
            new webpack.EnvironmentPlugin(process.env)
        );

        // Additional customization for Webpack can go here if necessary
        return config;
    },
};

export default nextConfig;
