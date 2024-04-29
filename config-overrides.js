const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "tty": require.resolve("tty-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url/"),
        "buffer": require.resolve("buffer/"),
        "zlib": require.resolve("browserify-zlib"),
        "path": require.resolve("path-browserify"),
        "fs": require.resolve("fs"),
        'process/browser': require.resolve('process/browser')
    })
    config.resolve.fallback = fallback;
    config.externals = {
        "node:crypto": "crypto"
    }
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            fs: "empty"
        })
    ])

    config.ignoreWarnings = [/Failed to parse source map/];
    config.experiments = ({ topLevelAwait: true });
    return config;
}