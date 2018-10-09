module.exports = {
    apps: [{
        name: 'pm2-monitoring-backend',
        script: 'app.js',
        env: {
            NODE_ENV: 'production'
        }
    }]
};
