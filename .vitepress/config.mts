import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LaraGram",
  description: "An advanced framework for Telegram Bot development.",
  themeConfig: {
    siteTitle: 'LaraGram',
    logo: '/my-logo.svg',

    search: {
      provider: 'local'
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Document', link: '/installation' }
    ],

    sidebar: [
      {
        text: 'Prologue',
        collapsed: true,
        items: [
          { text: 'Release Notes', link: '/releases' },
          { text: 'Upgrade Guide', link: '/upgrade' },
          { text: 'Contributions Guide', link: '/contributions' },
        ]
      },
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation', link: '/installation' },
          { text: 'Configuration', link: '/configuration' },
          { text: 'Directory Structure', link: '/structure' },
          { text: 'Deployment', link: '/deployment' },
        ]
      },
      {
        text: 'Architecture Concepts',
        collapsed: true,
        items: [
          { text: 'Request Lifecycle', link: '/lifecycle' },
          { text: 'Service Container', link: '/container' },
          { text: 'Service Providers', link: '/providers' },
          { text: 'Facades', link: '/facades' },
        ]
      },
      {
        text: 'The Basics',
        collapsed: true,
        items: [
          { text: 'Listening', link: '/listening' },
          { text: 'Middleware', link: '/middleware' },
          { text: 'Controllers', link: '/controllers' },
          { text: 'Requests', link: '/requests' },
          { text: 'Templates', link: '/templates' },
          { text: 'Temple8 Templates', link: '/temple8' },
          { text: 'Validation', link: '/validation' },
          { text: 'Error Handling', link: '/errors' },
          { text: 'Logging', link: '/logging' },
        ]
      },
      {
        text: 'Digging Deeper',
        collapsed: true,
        items: [
          { text: 'Commander Console', link: '/commander' },
          { text: 'Cache', link: '/cache' },
          { text: 'Collections', link: '/collections' },
          { text: 'Concurrency', link: '/concurrency' },
          { text: 'Context', link: '/context' },
          { text: 'Contracts', link: '/contracts' },
          { text: 'Events', link: '/events' },
          { text: 'File Storage', link: '/filesystem' },
          { text: 'Helpers', link: '/helpers' },
          { text: 'Localization', link: '/localization' },
          { text: 'Package Development', link: '/packages' },
          { text: 'Processes', link: '/processes' },
          { text: 'Queues', link: '/queues' },
          { text: 'Rate Limiting', link: '/rate-limiting' },
          { text: 'Redirects', link: '/redirects' },
          { text: 'Strings', link: '/strings' },
          { text: 'Task Scheduling', link: '/scheduling' },
        ]
      },
      {
        text: 'Security',
        collapsed: true,
        items: [
          { text: 'Authentication', link: '/authentication' },
          { text: 'Authorization', link: '/authorization' },
          { text: 'Encryption', link: '/encryption' },
          { text: 'Hashing', link: '/hashing' },
        ]
      },
      {
        text: 'Database',
        collapsed: true,
        items: [
          { text: 'Getting Started', link: '/database' },
          { text: 'Query Builder', link: '/queries' },
          { text: 'Migrations', link: '/migrations' },
          { text: 'Seeding', link: '/seeding' },
          { text: 'Redis', link: '/redis' },
          { text: 'Mongodb', link: '/mongodb' },
        ]
      },
      {
        text: 'Eloquent ORM',
        collapsed: true,
        items: [
          { text: 'Getting Started', link: '/eloquent' },
          { text: 'Relationships', link: '/eloquent-relationships' },
          { text: 'Collections', link: '/eloquent-collections' },
          { text: 'Mutators / Casts', link: '/eloquent-mutators' },
          { text: 'Serialization', link: '/eloquent-serialization' },
          { text: 'Factories', link: '/eloquent-factories' },
        ]
      },
      {
        text: 'Packages',
        collapsed: true,
        items: [
          { text: 'Surge', link: '/surge' },
          { text: 'Prompts', link: '/prompts' },
          { text: 'Tempora', link: '/tempora' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/laraXgram/LaraGram' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present LaraXGram'
    }
  }
})


