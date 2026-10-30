---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "LaraGram"
  text: "The AI-ready, full-stack Telegram framework"
  tagline: "Bots, MTProto userbots, Telegram Mini Apps, APIs, web pages and admin panels — all in one expressive PHP framework, all in one codebase."
  image:
    src: /LaraGram.svg
    alt: LaraGram
  actions:
    - theme: brand
      text: Get Started
      link: /v4/installation
    - theme: alt
      text: What's New in 4
      link: /v4/releases#laragram-4
    - theme: alt
      text: GitHub
      link: https://github.com/laraXgram
    - theme: alt
      text: Simula
      link: /simula

features:
  - icon: 🧠
    title: AI-Ready
    details: Turn a bot into an AI assistant in one line. Agents stream answers into the chat, read the photos and voice messages users send, answer with quizzes, polls and keyboards, and ask for approval through inline buttons. Expose your app to AI clients with MCP, and give your coding agent LaraGram's conventions and a bot it can run locally with Brain.
    link: /v4/ai
    linkText: Agentic development
  - icon: 🚀
    title: MTProto & Userbots
    details: Go beyond the Bot API. Connect through Telegram's own protocol and act as a real Telegram client — log in as a user, read full chat history, download files of any size, receive hundreds of update types and run many accounts in one process.
    link: /v4/mtproto
    linkText: Explore MTProto
  - icon: 📱
    title: Telegram Mini Apps
    details: Build Mini Apps with React, Vue or Svelte through Luna — no separate API to write. Init data is validated for you, and the Telegram theme, MainButton, back button, CloudStorage, biometrics, location and payments are ready to use.
    link: /v4/luna-tma
    linkText: Build a Mini App
  - icon: 🔌
    title: APIs
    details: Ship REST APIs next to your bot with API routes, API resources and pagination. Citadel protects them with personal access tokens, a full OAuth2 server, SPA sessions and Telegram Mini App authentication — behind one guard.
    link: /v4/citadel
    linkText: Protect your API
  - icon: 🖥️
    title: Web Pages & Admin Panels
    details: Build websites, dashboards and admin panels for your bot with routing, controllers, Blade views, Luna SPAs, sessions, authentication and authorization, Vite asset bundling and live Precognition validation.
    link: /v4/frontend
    linkText: Build for the web
  - icon: 🛰️
    title: Your Own Bot API Server
    details: Run LaraGram API Server, a drop-in replacement for the official telegram-bot-api written in PHP on top of MTProto — uploads up to 2000 MB, downloads without a size limit, and compatible file_ids.
    link: /v4/apiserver
    linkText: Run the API server
  - icon: 🧭
    title: Listening System
    details: Handle every kind of Telegram update with a listening system modeled on routing — commands, text patterns, callback queries and more — with middleware, controllers, validation and rate limiting, over a typed Bot API client.
    link: /v4/listening
  - icon: 🧩
    title: Temple8, Rich Messages & Conversations
    details: Write replies as Blade-like templates, build keyboards and Telegram rich messages with tables, lists and checklists, and declare multi-step conversations that validate every answer.
    link: /v4/temple8
  - icon: 📢
    title: Broadcasting
    details: Reach every user, group or channel in one line. Broadcasts are queued, paced against flood limits, filterable, schedulable, and can be edited or recalled after sending.
    link: /v4/broadcasting
  - icon: 🗄️
    title: Eloquent ORM
    details: A full Eloquent ORM for MySQL, MariaDB, PostgreSQL, SQLite and SQL Server, with relationships, migrations, seeders and factories, plus MongoDB through laraxgram/mongodb.
    link: /v4/eloquent
  - icon: 🛡️
    title: Queues, Scheduling & Sentinel
    details: Move slow work to queues, schedule tasks fluently, and watch it all with Sentinel — an update debugger, metrics monitor and Redis queue supervisor in one web dashboard.
    link: /v4/sentinel
  - icon: ⚡
    title: Surge
    details: Boot your application once and serve bot updates and web requests from memory with Swoole, Open Swoole, RoadRunner or FrankenPHP.
    link: /v4/surge
---

## One Framework, Every Telegram Surface

The same listens, models, queues and templates power every part of your project. Write a bot, add a userbot, open a Mini App and serve an API or admin panel — without switching frameworks or copying code between projects.

::: code-group

```php [AI Assistant]
// listens/bot.php — answers every message: streams the reply,
// reads photos and documents, transcribes voice messages.
use App\Ai\Agents\SupportAgent;
use LaraGram\Support\Facades\Bot;

Bot::agent(SupportAgent::class);
```

```php [Bot]
// listens/bot.php
use LaraGram\Request\Request;
use LaraGram\Support\Facades\Bot;

Bot::onText('say {text}', function (Request $request, string $text) {
    $request->sendMessage(chat()->id, $text);
});
```

```php [MTProto Userbot]
// listens/client.php
use LaraGram\MTProto\Facades\Client;
use LaraGram\MTProto\Foundation\ClientRequest;

Client::onText('hello', function (ClientRequest $request) {
    $request->sendMessage(peer: $request->chatId(), message: 'hi 👋');
});
```

```php [Mini App]
// routes/web.php — every request carries validated Telegram init data
use App\Http\Controllers\ProfileController;
use LaraGram\Support\Facades\Route;

Route::middleware('telegram')->group(function () {
    Route::get('/', [ProfileController::class, 'show'])->name('profile');
    Route::post('/profile', [ProfileController::class, 'update']);
});
```

```php [API]
// routes/api.php — tokens, OAuth2 and Mini Apps through one guard
use LaraGram\Http\Request;
use LaraGram\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:citadel');
```

```php [Admin Panel]
// routes/web.php — a Luna page rendered by React, Vue or Svelte
use App\Models\User;
use LaraGram\Luna\Luna;
use LaraGram\Support\Facades\Route;

Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('/users', fn () => Luna::render('Admin/Users', [
        'users' => User::latest()->paginate(20),
    ]));
});
```

:::

## Get Started in a Minute

```shell
composer global require laraxgram/installer

laragram new my-bot

cd my-bot
php laragram dev
```

The installer sets up your bot token and webhook, and optionally a local Bot API server, MTProto, a Mini App starter kit, API routes, LaraGram Brain and Surge. The `dev` command then runs everything your application needs side by side.
