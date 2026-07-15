export default [
    {
        text: 'Prologue', collapsed: true,
        items: [
            { text: 'Release Notes', link: '/v4/releases' },
            { text: 'Upgrade Guide', link: '/v4/upgrade' },
            { text: 'Contributions Guide', link: '/v4/contributions' },
        ]
    },
    {
        text: 'Getting Started', collapsed: true,
        items: [
            { text: 'Installation', link: '/v4/installation' },
            { text: 'Configuration', link: '/v4/configuration' },
            { text: 'Directory Structure', link: '/v4/structure' },
            { text: 'Frontend and TMAs', link: '/v4/frontend' },
            { text: 'Starter Kits', link: '/v4/starter-kits' },
            { text: 'Deployment', link: '/v4/deployment' },
        ]
    },
    {
        text: 'Architecture Concepts', collapsed: true,
        items: [
            { text: 'Request Lifecycle', link: '/v4/lifecycle' },
            { text: 'Service Container', link: '/v4/container' },
            { text: 'Service Providers', link: '/v4/providers' },
            { text: 'Facades', link: '/v4/facades' },
        ]
    },
    {
        text: 'The Basics', collapsed: true,
        items: [
            { text: 'Listening', link: '/v4/listening' },
            { text: 'Middleware', link: '/v4/middleware' },
            { text: 'Controllers', link: '/v4/controllers' },
            { text: 'Requests', link: '/v4/requests' },
            { text: 'Keyboard Builder', link: '/v4/keyboards' },
            { text: 'Templates', link: '/v4/templates' },
            { text: 'Temple8 Templates', link: '/v4/temple8' },
            { text: 'Validation', link: '/v4/validation' },
            { text: 'Step Manager', link: '/v4/step' },
            { text: 'Conversation', link: '/v4/conversations' },
            { text: 'Error Handling', link: '/v4/errors' },
            { text: 'Logging', link: '/v4/logging' },
        ]
    },
    {
        text: 'Digging Deeper', collapsed: true,
        items: [
            { text: 'Commander Console', link: '/v4/commander' },
            { text: 'Cache', link: '/v4/cache' },
            { text: 'Collections', link: '/v4/collections' },
            { text: 'Concurrency', link: '/v4/concurrency' },
            { text: 'Context', link: '/v4/context' },
            { text: 'Contracts', link: '/v4/contracts' },
            { text: 'Events', link: '/v4/events' },
            { text: 'File Storage', link: '/v4/filesystem' },
            { text: 'Helpers', link: '/v4/helpers' },
            { text: 'HTTP Client', link: '/v4/http-client' },
            { text: 'Localization', link: '/v4/localization' },
            { text: 'Package Development', link: '/v4/packages' },
            { text: 'Processes', link: '/v4/processes' },
            { text: 'Queues', link: '/v4/queues' },
            { text: 'Rate Limiting', link: '/v4/rate-limiting' },
            { text: 'Strings', link: '/v4/strings' },
            { text: 'Task Scheduling', link: '/v4/scheduling' },
        ]
    },
    {
        text: 'MTProto', collapsed: true,
        items: [
            { text: 'Getting Start', link: '/v4/mtproto' },
            { text: 'Configuration', link: '/v4/mtproto-configuration' },
            { text: 'Authentication', link: '/v4/mtproto-authentication' },
            { text: 'Listening', link: '/v4/mtproto-listening' },
            { text: 'Requests', link: '/v4/mtproto-requests' },
            { text: 'Chats & Channels', link: '/v4/mtproto-chats' },
            { text: 'Features', link: '/v4/mtproto-features' },
            { text: 'Media', link: '/v4/mtproto-media' },
        ]
    },
    {
        text: 'TMAs & SPAs', collapsed: true,
        items: [
            { text: 'Getting Start', link: '/v4/luna' },
            { text: 'Routing', link: '/v4/luna-routing' },
            { text: 'Pages', link: '/v4/luna-pages' },
            { text: 'Forms', link: '/v4/luna-forms' },
            { text: 'Frontend', link: '/v4/luna-frontend' },
            { text: 'TMAs', link: '/v4/luna-tma' },
            { text: 'TMAs Features', link: '/v4/luna-tma-features' },
        ]
    },
    {
        text: 'Web', collapsed: true,
        items: [
            { text: 'Routing', link: '/v4/routing' },
            { text: 'Http Requests', link: '/v4/http-requests' },
            { text: 'Http Response', link: '/v4/http-responses' },
            { text: 'Views', link: '/v4/views' },
            { text: 'Blade Templates', link: '/v4/blade' },
            { text: 'Luna', link: '/v4/luna' },
            { text: 'Asset Bundling', link: '/v4/vite' },
            { text: 'URL Generation', link: '/v4/urls' },
            { text: 'Session', link: '/v4/session' },
        ]
    },
    {
        text: 'Security', collapsed: true,
        items: [
            { text: 'Authentication', link: '/v4/authentication' },
            { text: 'Authorization', link: '/v4/authorization' },
            { text: 'Encryption', link: '/v4/encryption' },
            { text: 'Hashing', link: '/v4/hashing' },
        ]
    },
    {
        text: 'Database', collapsed: true,
        items: [
            { text: 'Getting Started', link: '/v4/database' },
            { text: 'Query Builder', link: '/v4/queries' },
            { text: 'Pagination', link: '/v4/pagination' },
            { text: 'Migrations', link: '/v4/migrations' },
            { text: 'Seeding', link: '/v4/seeding' },
            { text: 'Redis', link: '/v4/redis' },
            { text: 'Mongodb', link: '/v4/mongodb' },
        ]
    },
    {
        text: 'Eloquent ORM', collapsed: true,
        items: [
            { text: 'Getting Started', link: '/v4/eloquent' },
            { text: 'Relationships', link: '/v4/eloquent-relationships' },
            { text: 'Collections', link: '/v4/eloquent-collections' },
            { text: 'API Resources', link: '/v4/eloquent-resources' },
            { text: 'Mutators / Casts', link: '/v4/eloquent-mutators' },
            { text: 'Serialization', link: '/v4/eloquent-serialization' },
            { text: 'Factories', link: '/v4/eloquent-factories' },
        ]
    },
    {
        text: 'Packages', collapsed: true,
        items: [
            { text: 'Prompts', link: '/v4/prompts' },
            { text: 'Surge', link: '/v4/surge' },
            { text: 'Tempora', link: '/v4/tempora' },
            { text: 'Watchdog', link: '/v4/watchdog' },
        ]
    },
]