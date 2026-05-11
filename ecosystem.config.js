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
      script: './start-web.sh',
      cwd: '/var/www/rukunin',
      instances: 1,
      exec_mode: 'fork',
      kill_timeout: 20000,
      restart_delay: 20000,
      max_restarts: 30,
      max_memory_restart: '300M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
