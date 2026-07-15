import { defineConfig } from 'vitepress'
import { SearchPlugin } from "vitepress-plugin-search";


import v3Sidebar from './sidebars/v3'
import v4Sidebar from './sidebars/v4'
import masterSidebar from './sidebars/master'

const DEFAULT_VERSION = 'v4'

// Versions
const versions = {
    v3: { text: 'Version 3', path: '/v3/' },
    v4: { text: 'Version 4', path: '/v4/' },
    master: { text: 'Master', path: '/master/' }
}

const options = {
    previewLength: 62,
    buttonLabel: "Search",
    placeholder: "Search docs",
    allow: [],
    ignore: [],
};

export default defineConfig({
    vite: {
        plugins: [SearchPlugin(options)],
    },

    ignoreDeadLinks: true,
    base: '/',
    title: 'LaraGram',
    description: 'An advanced framework for Telegram Bot development.',
    srcDir: './src',

    sitemap: {
        hostname: 'https://laraxgram.github.io/',
    },

    head: [ ['link', { rel: 'icon', href: '/favicon.ico' }] ],

    themeConfig: {
        siteTitle: 'LaraGram',
        logo: '/LaraGram.svg',
        outline: 'deep',

        nav: [
            { text: 'Home', link: '/' },
            {
                text: 'Another Products',
                items: [{text: "Simula", link: '/simula'}]
            },
            { text: 'Document', link: versions[DEFAULT_VERSION].path + 'installation' },
        ],

        sidebar: {
            '/v3/': v3Sidebar,
            '/v4/': v4Sidebar,
            '/master/': masterSidebar
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/laraXgram' },
            { icon: 'telegram', link: 'https://t.me/LaraXGram' },
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2023-present LaraXGram'
        }
    }
})