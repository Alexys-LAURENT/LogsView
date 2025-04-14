module.exports = {
  apps: [
    {
      name: 'logs-view',
      script: 'npm start',
      cwd: './',
      time: true,
      autorestart: false,
      watch: true,
      ignore_watch: ['node_modules', '.vscode', 'tmp', '.github', 'tests', '\\.git', '\\.log'],
    },
  ],
}
