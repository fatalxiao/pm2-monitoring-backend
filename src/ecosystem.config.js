module.exports = {
    apps: [{
        name: 'dplatform-click-web-testing',
        script: './pm2-apps/dplatform-click-web-testing/server.js',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
};