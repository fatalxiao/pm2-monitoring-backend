module.exports = {
    apps: [{
        name: 'pm2-monitoring-backend',
        script: './dist/app.js',
        env: {
            NODE_ENV: 'production'
        }
    }]
};
