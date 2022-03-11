module.exports = {
  apps: [
    {
      name: process.env.APP_NAME,
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      watch: true,
      watch_delay: 1000,
      script: './node_modules/nuxt/bin/nuxt.js',
      ignore_watch: ['node_modules'],
      args: 'start'
    }
  ]
}
