module.exports = {
    apps: [{
        name: 'alcedo-ui',
        script: './pm2-apps/alcedo-ui/server.js',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
};