module.exports = {
  apps: [
    {
      name: 'rukunin-api',
      script: './apps/api/dist/main.js',
      cwd: '/var/www/rukunin',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'rukunin-web',
      script: 'node_modules/.bin/next',
      args: 'start --port 3000',
      cwd: '/var/www/rukunin/apps/web',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
