module.exports = {
  apps: [
    {
      name: 'xero-connect',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max', // Utilizes all CPU cores
      exec_mode: 'cluster',
      watch: false, // Avoid restart on file changes
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '1G',
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};

