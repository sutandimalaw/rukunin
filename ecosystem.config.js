module.exports = {
  apps: [
    {
      name: 'rukunin-api',
      script: './start-api.sh',
      cwd: '/var/www/rukunin',
      instances: 1,
      exec_mode: 'fork',
      kill_timeout: 10000, // 10 seconds
      restart_delay: 5000, // 5 seconds
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
      kill_timeout: 10000, // 10 seconds
      restart_delay: 5000, // 5 seconds
      max_restarts: 5,
      min_uptime: '60s',
      max_memory_restart: '300M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
