import {defineConfig} from 'vitepress'

const DEFAULT_VERSION = 'v3'

const baseSidebar = [
    {
        text: 'Prologue',
        collapsed: true,
        items: [
            {text: 'Release Notes', link: '/releases'},
            {text: 'Upgrade Guide', link: '/upgrade'},
            {text: 'Contributions Guide', link: '/contributions'},
        ]
    },
    {
        text: 'Getting Started',
        collapsed: true,
        items: [
            {text: 'Installation', link: '/installation'},
            {text: 'Configuration', link: '/configuration'},
            {text: 'Directory Structure', link: '/structure'},
            {text: 'Deployment', link: '/deployment'},
        ]
    },
    {
        text: 'Architecture Concepts',
        collapsed: true,
        items: [
            {text: 'Request Lifecycle', link: '/lifecycle'},
            {text: 'Service Container', link: '/container'},
            {text: 'Service Providers', link: '/providers'},
            {text: 'Facades', link: '/facades'},
        ]
    },
    {
        text: 'The Basics',
        collapsed: true,
        items: [
            {text: 'Listening', link: '/listening'},
            {text: 'Middleware', link: '/middleware'},
            {text: 'Controllers', link: '/controllers'},
            {text: 'Requests', link: '/requests'},
            {text: 'Keyboard Builder', link: '/keyboards'},
            {text: 'Templates', link: '/templates'},
            {text: 'Temple8 Templates', link: '/temple8'},
            {text: 'Validation', link: '/validation'},
            {text: 'Error Handling', link: '/errors'},
            {text: 'Logging', link: '/logging'},
        ]
    },
    {
        text: 'Digging Deeper',
        collapsed: true,
        items: [
            {text: 'Commander Console', link: '/commander'},
            {text: 'Cache', link: '/cache'},
            {text: 'Collections', link: '/collections'},
            {text: 'Concurrency', link: '/concurrency'},
            {text: 'Context', link: '/context'},
            {text: 'Contracts', link: '/contracts'},
            {text: 'Events', link: '/events'},
            {text: 'File Storage', link: '/filesystem'},
            {text: 'Helpers', link: '/helpers'},
            {text: 'Localization', link: '/localization'},
            {text: 'Package Development', link: '/packages'},
            {text: 'Processes', link: '/processes'},
            {text: 'Queues', link: '/queues'},
            {text: 'Rate Limiting', link: '/rate-limiting'},
            {text: 'Redirects', link: '/redirects'},
            {text: 'Strings', link: '/strings'},
            {text: 'Task Scheduling', link: '/scheduling'},
        ]
    },
    {
        text: 'Security',
        collapsed: true,
        items: [
            {text: 'Authentication', link: '/authentication'},
            {text: 'Authorization', link: '/authorization'},
            {text: 'Encryption', link: '/encryption'},
            {text: 'Hashing', link: '/hashing'},
        ]
    },
    {
        text: 'Database',
        collapsed: true,
        items: [
            {text: 'Getting Started', link: '/database'},
            {text: 'Query Builder', link: '/queries'},
            {text: 'Migrations', link: '/migrations'},
            {text: 'Seeding', link: '/seeding'},
            {text: 'Redis', link: '/redis'},
            {text: 'Mongodb', link: '/mongodb'},
        ]
    },
    {
        text: 'Eloquent ORM',
        collapsed: true,
        items: [
            {text: 'Getting Started', link: '/eloquent'},
            {text: 'Relationships', link: '/eloquent-relationships'},
            {text: 'Collections', link: '/eloquent-collections'},
            {text: 'Mutators / Casts', link: '/eloquent-mutators'},
            {text: 'Serialization', link: '/eloquent-serialization'},
            {text: 'Factories', link: '/eloquent-factories'},
        ]
    },
    {
        text: 'Packages',
        collapsed: true,
        items: [
            {text: 'Surge', link: '/surge'},
            {text: 'Watchdog', link: '/watchdog'},
            {text: 'Prompts', link: '/prompts'},
            {text: 'Tempora', link: '/tempora'},
        ]
    },
]

const addPrefix = (items, prefix) => {
    return items.map(item => {
        const newItem = { ...item }
        if (newItem.link) {
            newItem.link = prefix + newItem.link
        }
        if (newItem.items) {
            newItem.items = addPrefix(newItem.items, prefix)
        }
        return newItem
    })
}

const versions = {
    'v3': { text: 'Version 3', path: '/v3/' },
    'master': { text: 'Master', path: '/master/' }
};

const versionSidebars = Object.fromEntries(
    Object.entries(versions).map(([, v]) => [v.path, addPrefix(baseSidebar, v.path)])
);

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: '/',
    title: "LaraGram",
    description: "An advanced framework for Telegram Bot development.",
    srcDir: './src',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    rewrites: {
        '/': versions[DEFAULT_VERSION].path
    },
    themeConfig: {
        siteTitle: 'LaraGram',
        logo: '/LaraGram.svg',
        outline: 'deep',
        search: {
            provider: 'local',
            options: {
                _render(src, env, md) {
                    if (!env.relativePath.startsWith(DEFAULT_VERSION + '/')) {
                        return ''
                    }

                    return md.render(src, env)
                }
            }
        },
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Document', link: versions[DEFAULT_VERSION].path + 'installation'},
            {
                text: 'Version',
                items: Object.values(versions).map(v => ({ text: v.text, link: v.path + 'installation' }))
            }
        ],
        versions: {
            text: versions[DEFAULT_VERSION].text,
            items: Object.values(versions).map(v => ({ text: v.text, link: v.path + 'installation' }))
        },
        sidebar: versionSidebars,
        socialLinks: [
            {icon: 'github', link: 'https://github.com/laraXgram/LaraGram'},
            {icon: 'telegram', link: 'https://t.me/LaraXGram'},
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2023-present LaraXGram'
        },
    }
})
