# LaraGram Brain

<a name="introduction"></a>
## Introduction

LaraGram Brain accelerates AI-assisted development by providing the essential guidelines and agent skills that help AI agents write high-quality LaraGram applications that adhere to LaraGram best practices — Telegram bots, MTProto clients, Telegram Mini Apps built with Luna, and web applications alike.

Brain also ships an MCP server that lets agents inspect your application, search the LaraGram documentation offline, and try your bot out locally: listing listens, running fake updates through them, rendering templates and reading conversation state, without a single call reaching Telegram.

<a name="installation"></a>
## Installation

LaraGram Brain is a development tool for your LaraGram application and is installed via Composer:

```shell
composer require laraxgram/brain --dev
```

Next, install the MCP server, coding guidelines and agent skills:

```shell
php laragram brain:install
```

The `brain:install` command detects the coding agents installed on your machine and used in your project, then asks which features (guidelines, skills, MCP server) and which agents to set up. It generates the relevant guideline and skill files for each agent you selected. You may install a single feature with the `--guidelines`, `--skills` or `--mcp` options.

Once LaraGram Brain has been installed, you're ready to start coding with Claude Code, Codex, Cursor, or your AI agent of choice.

> [!NOTE]
> Brain only runs in the `local` environment, or when `APP_DEBUG` is `true`. In any other environment its MCP server, routes and browser logger are not registered.

> [!NOTE]
> Feel free to add the generated MCP configuration files (`.mcp.json`, `.cursor/mcp.json`, etc.), guideline files (`CLAUDE.md`, `AGENTS.md`), agent skill directories (`.claude/skills`, `.agents/skills`, etc.), and the `brain.json` configuration file to your application's `.gitignore`, as these files are automatically regenerated when running `brain:install` and `brain:update`.

<a name="supported-agents"></a>
### Supported Agents

Brain supports the following agents out of the box:

<div class="overflow-auto">

| Agent          | Guidelines  | Skills             | MCP Configuration          |
| -------------- | ----------- | ------------------ | -------------------------- |
| Amp            | `AGENTS.md` | `.agents/skills`   | `.amp/settings.json`       |
| Antigravity    | `AGENTS.md` | `.agents/skills`   | `.agents/mcp_config.json`  |
| Claude Code    | `CLAUDE.md` | `.claude/skills`   | `.mcp.json`                |
| Codex          | `AGENTS.md` | `.agents/skills`   | `.codex/config.toml`       |
| Cursor         | `AGENTS.md` | `.cursor/skills`   | `.cursor/mcp.json`         |
| Factory Droid  | `AGENTS.md` | `.factory/skills`  | `.factory/mcp.json`        |
| GitHub Copilot | `AGENTS.md` | `.github/skills`   | `.vscode/mcp.json`         |
| Grok Build     | `AGENTS.md` | `.grok/skills`     | `.grok/config.toml`        |
| Junie          | `AGENTS.md` | `.junie/skills`    | `.junie/mcp/mcp.json`      |
| Kiro           | `AGENTS.md` | `.kiro/skills`     | `.kiro/settings/mcp.json`  |
| OpenCode       | `AGENTS.md` | `.agents/skills`   | `opencode.json`            |
| Pi             | `AGENTS.md` | `.pi/skills`       | —                          |
| Zed            | `AGENTS.md` | `.agents/skills`   | `.zed/settings.json`       |

</div>

Each path may be changed with the `brain.agents.{agent}.guidelines_path`, `brain.agents.{agent}.skills_path` and `brain.agents.{agent}.mcp_config_path` configuration options. If your agent is not listed, you may [add support for it](#extending-brain).

<a name="set-up-your-agents"></a>
### Set Up Your Agents

```text tab=Claude Code
Claude Code support is typically enabled automatically. If you find it isn't, open a shell in the project's directory and run the following command:

claude mcp add -s local -t stdio laragram-brain php laragram brain:mcp
```

```text tab=Codex
Codex support is typically enabled automatically. If you find it isn't, open a shell in the project's directory and run the following command:

codex mcp add laragram-brain -- php "laragram" "brain:mcp"
```

```text tab=Cursor
1. Open the command palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
2. Press `enter` on "/open MCP Settings"
3. Turn the toggle on for `laragram-brain`
```

```text tab=GitHub Copilot (VS Code)
1. Open the command palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
2. Press `enter` on "MCP: List Servers"
3. Arrow to `laragram-brain` and press `enter`
4. Choose "Start server"
```

```text tab=Junie
1. Press `shift` twice to open the command palette
2. Search "MCP Settings" and press `enter`
3. Check the box next to `laragram-brain`
4. Click "Apply" at the bottom right
```

<a name="keeping-brain-resources-updated"></a>
### Keeping Brain Resources Updated

You may want to periodically update your local Brain resources (AI guidelines and skills) to ensure they reflect the latest versions of the LaraGram ecosystem packages you have installed. To do so, you can use the `brain:update` Commander command.

```shell
php laragram brain:update
```

You may also automate this process by adding it to your Composer "post-update-cmd" scripts:

```json
{
  "scripts": {
    "post-update-cmd": [
      "@php laragram brain:update --ansi"
    ]
  }
}
```

The `brain:update` command also scans your application for newly installed packages that ship guidelines or skills and offers to add them. The prompt is skipped when the command runs without interaction or from a Composer script, so an unattended `composer update` is never blocked. To skip the scan entirely, use the `--no-discover` option; to leave your skills directory untouched, use `--ignore-skills`:

```shell
php laragram brain:update --no-discover
```

<a name="configuration"></a>
### Configuration

Brain works without a configuration file. To change its defaults, publish the `config/brain.php` file:

```shell
php laragram vendor:publish --tag=brain-config
```

The most common options are also available as environment variables:

<div class="overflow-auto">

| Variable                     | Default                    | Description                                                         |
| ---------------------------- | -------------------------- | ------------------------------------------------------------------- |
| `BRAIN_ENABLED`              | `true`                     | Disable Brain entirely.                                             |
| `BRAIN_RULES_ENABLED`        | `true`                     | Enable [project rules](#project-rules) and the `record-rule` tool.  |
| `BRAIN_BOT_RUNTIME_TOOLS`    | `true`                     | Expose the [bot runtime tools](#bot-runtime-tools).                 |
| `BRAIN_BROWSER_LOGS_WATCHER` | `true`                     | Capture browser console logs, including from Mini Apps.             |
| `BRAIN_BROWSER_LOG_LEVELS`   | `error,warning,info,debug` | The browser console levels to capture.                              |
| `BRAIN_PHP_EXECUTABLE_PATH`  | —                          | A custom PHP binary for the generated MCP configuration.            |

</div>

The configuration file also lets you exclude guidelines (`guidelines.exclude`) and skills (`skills.exclude`) by the names shown in the `brain:install` summary, and toggle the [Probe tool](#available-mcp-tools) with the `probe_tool_enabled` option.

<a name="mcp-server"></a>
## MCP Server

LaraGram Brain provides an MCP (Model Context Protocol) server, built with [LaraGram MCP](/v4/mcp), that exposes tools for AI agents to interact with your LaraGram application. These tools give agents the ability to inspect your application's structure, query the database, execute code, and try your bot out — listing listens, running fake updates through them, rendering templates and reading conversation state — without a single call reaching Telegram.

<a name="available-mcp-tools"></a>
### Available MCP Tools

<div class="overflow-auto">

| Name                 | Notes                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application Info     | Read PHP & LaraGram versions, database engine, installed packages with versions, bot connections, MTProto sessions, Surge, Luna and MCP details. Tokens and secrets are never included |
| Browser Logs         | Read logs and errors from the browser, including Telegram Mini Apps served by [Luna](/v4/luna)                                                       |
| Database Connections | Inspect available database connections, including the default connection                                                                            |
| Database Query       | Execute a read-only query against the database                                                                                                       |
| Database Schema      | Read the database schema: tables, columns, indexes and foreign keys                                                                                  |
| Get Absolute URL     | Convert relative path URIs and named routes to absolute URLs so agents generate valid URLs                                                           |
| Last Error           | Read the last error from the application's log files                                                                                                 |
| Read Log Entries     | Read the last N log entries                                                                                                                          |
| Record Rule          | Record a durable [project rule](#project-rules) into `.ai/rules` so future agents inherit it                                                         |
| Search Docs          | Search the LaraGram documentation and the Telegram Bot API offline, limited to the packages you have installed. See [Documentation Search](#documentation-search) |
| Probe                | Evaluate PHP inside the booted application, the way [Probe](/v4/commander#probe) does. Registered only when the `probe` command is available        |

</div>

<a name="bot-runtime-tools"></a>
### Bot Runtime Tools

When [`laraxgram/mcp`](/v4/mcp) is installed, Brain also exposes its bot runtime tool set, which lets an agent try your bot out locally. None of these tools send anything to Telegram:

<div class="overflow-auto">

| Name                     | Notes                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `bot_listens`            | List the registered listens: update type, pattern, name, handler, middleware and bot connections              |
| `bot_simulate_update`    | Run an update through the listens like a real webhook call, and report the matched listen and every Bot API call the handlers made |
| `bot_render_template`    | Render a Temple8 template (rich messages and keyboards included) for a chat and report the calls it would make |
| `bot_conversation_state` | Inspect the conversation a user is in, or forget it to reset them                                              |

</div>

They are enabled only in the `local` environment, and may be turned off with the `brain.bot_runtime_tools` configuration option.

<a name="mcp-prompts-and-resources"></a>
### Prompts and Resources

Alongside its tools, the Brain MCP server offers the following prompts and resources:

<div class="overflow-auto">

| Name                       | Type     | Notes                                                                                   |
| -------------------------- | -------- | --------------------------------------------------------------------------------------- |
| `laragram-code-simplifier` | Prompt   | Simplify and refine recently modified PHP/LaraGram code while preserving its behavior   |
| `upgrade-laragram-v4`      | Prompt   | Step-by-step guidance for upgrading an application from LaraGram 3.x to 4.0             |
| Application Info           | Resource | PHP & LaraGram versions, database engine and installed packages with their versions     |

</div>

<a name="customizing-mcp-tools"></a>
### Customizing MCP Tools

You may remove a built-in tool, or add a tool of your own, from the `mcp` section of your `config/brain.php` file. Tools are referenced by class name:

```php
'mcp' => [
    'tools' => [
        'exclude' => [
            LaraGram\Brain\Mcp\Tools\DatabaseQuery::class,
        ],
        'include' => [
            App\Mcp\Tools\TicketStats::class,
        ],
    ],
],
```

Prompts and resources may be excluded or included the same way, through the `mcp.prompts` and `mcp.resources` options.

<a name="manually-registering-the-mcp-server"></a>
### Manually Registering the MCP Server

Sometimes you may need to manually register the LaraGram Brain MCP server with your editor of choice. You should register the MCP server using the following details:

<table>
<tr><td><strong>Command</strong></td><td><code>php</code></td></tr>
<tr><td><strong>Args</strong></td><td><code>laragram brain:mcp</code></td></tr>
</table>

JSON example:

```json
{
    "mcpServers": {
        "laragram-brain": {
            "command": "php",
            "args": ["laragram", "brain:mcp"]
        }
    }
}
```

<a name="ai-guidelines"></a>
## AI Guidelines

AI guidelines are composable instruction files that are loaded upfront to provide AI agents with essential context about LaraGram ecosystem packages. These guidelines contain core conventions, best practices, and framework-specific patterns that help agents generate consistent, high-quality code.

<a name="available-ai-guidelines"></a>
### Available AI Guidelines

LaraGram Brain includes AI guidelines for the following packages. The `core` guidelines provide advice for the given package that is applicable across all of its versions, while versioned guidelines are only added when that major version is installed. The Foundation, Brain, PHP and Deployment guidelines are always included; every other guideline is included when its package is installed.

<div class="overflow-auto">

| Package                                      | Versions Supported |
| -------------------------------------------- | ------------------ |
| Foundation, Brain, PHP & Deployment          | core               |
| LaraGram Framework (`laraxgram/core`)        | core, 4.x          |
| Laraquest (`laraxgram/laraquest`)            | core               |
| MTProto (`laraxgram/mtproto`)                | core               |
| Luna (`laraxgram/luna`)                      | core               |
| Luna React (`@laraxgram/react`)              | core               |
| Luna Vue (`@laraxgram/vue3`)                 | core               |
| Luna Svelte (`@laraxgram/svelte`)            | core               |
| AI SDK (`laraxgram/ai`)                      | core               |
| MCP (`laraxgram/mcp`)                        | core               |
| Citadel (`laraxgram/citadel`)                | core               |
| Sentinel (`laraxgram/sentinel`)              | core               |
| Surge (`laraxgram/surge`)                    | core               |
| Probe (`laraxgram/probe`)                    | core               |
| Tempora (`laraxgram/tempora`)                | core               |
| Watchdog (`laraxgram/watchdog`)              | core               |

</div>

> **Note:** To keep your AI guidelines up-to-date, see the [Keeping Brain Resources Updated](#keeping-brain-resources-updated) section.

<a name="adding-custom-ai-guidelines"></a>
### Adding Custom AI Guidelines

To augment LaraGram Brain with your own custom AI guidelines, add `.blade.php` or `.md` files to your application's `.ai/guidelines/*` directory. These files will automatically be included with LaraGram Brain's guidelines when you run `brain:install`.

<a name="overriding-brain-ai-guidelines"></a>
### Overriding Brain AI Guidelines

You can override Brain's built-in AI guidelines by creating your own custom guidelines with matching file paths. When you create a custom guideline that matches an existing Brain guideline path, Brain will use your custom version instead of the built-in one.

For example, to override Brain's core MTProto guidelines, create a file at `.ai/guidelines/mtproto/core.blade.php`. When you run `brain:install`, Brain will include your custom guideline instead of the default one.

<a name="third-party-package-ai-guidelines"></a>
### Third-Party Package AI Guidelines

If you maintain a third-party package and would like Brain to include AI guidelines for it, you can do so by adding a `resources/brain/guidelines/core.blade.php` file to your package. When users of your package run `php laragram brain:install`, Brain will offer to load your guidelines.

AI guidelines should provide a short overview of what your package does, outline any required file structure or conventions, and explain how to create or use its main features (with example commands or code snippets). Keep them concise, actionable, and focused on best practices so AI can generate correct code for your users. Here is an example:

```php
## Package Name

This package provides [brief description of functionality].

### Features

- Feature 1: [clear & short description].
- Feature 2: [clear & short description]. Example usage:

@verbatim
<code-snippet name="How to use Feature 2" lang="php">
$result = PackageName::featureTwo($param1, $param2);
</code-snippet>
@endverbatim
```

<a name="agent-skills"></a>
## Agent Skills

[Agent Skills](https://agentskills.io/home) are lightweight, targeted knowledge modules that agents can activate on-demand when working on specific domains. Unlike guidelines, which are loaded upfront, skills allow detailed patterns and best practices to be loaded only when relevant, reducing context bloat and improving the relevance of AI-generated code.

When you run `brain:install` and select skills as a feature, skills are automatically installed based on the packages detected in your `composer.json` and `package.json`. For example, if your project includes `laraxgram/mtproto`, the `mtproto-development` skill will be installed automatically. Skills included with Brain itself, such as `infer-conventions` and `deploying-laragram`, are installed regardless of which packages you have.

<a name="available-skills"></a>
### Available Skills

<div class="overflow-auto">

| Skill                       | Package                         |
| --------------------------- | ------------------------------- |
| bot-development             | LaraGram Framework              |
| commander-development       | LaraGram Framework              |
| image-manipulation          | LaraGram Framework              |
| laragram-best-practices     | LaraGram Framework              |
| infer-conventions           | Brain                           |
| deploying-laragram          | Brain                           |
| mtproto-development         | MTProto                         |
| luna-development            | Luna                            |
| luna-tma-development        | Luna                            |
| luna-react-development      | Luna React                      |
| luna-vue-development        | Luna Vue                        |
| luna-svelte-development     | Luna Svelte                     |
| ai-development              | AI SDK                          |
| mcp-development             | MCP                             |
| citadel-development         | Citadel                         |
| sentinel-debugging          | Sentinel                        |
| sentinel-queues             | Sentinel                        |
| surge-development           | Surge                           |
| tailwindcss-development     | Tailwind CSS (3.x, 4.x)         |

</div>

You may list the skills available to your project with the `brain:list-skills` command:

```shell
php laragram brain:list-skills
```

> **Note:** To keep your skills up-to-date, see the [Keeping Brain Resources Updated](#keeping-brain-resources-updated) section.

<a name="custom-skills"></a>
### Custom Skills

To create your own custom skills, add a `SKILL.md` file to your application's `.ai/skills/{skill-name}/` directory. When you run `brain:update`, your custom skills will be installed alongside Brain's built-in skills.

For example, to create a custom skill for your application's domain logic:

```
.ai/skills/creating-invoices/SKILL.md
```

<a name="overriding-skills"></a>
### Overriding Skills

You can override Brain's built-in skills by creating your own custom skills with matching names. When you create a custom skill that matches an existing Brain skill name, Brain will use your custom version instead of the built-in one.

For example, to override Brain's `bot-development` skill, create a file at `.ai/skills/bot-development/SKILL.md`. When you run `brain:update`, Brain will include your custom skill instead of the default one.

<a name="adding-skills-from-github"></a>
### Adding Skills From GitHub

Skills published in a GitHub repository may be added to your application with the `brain:add-skill` command. The command lists the skills found in the repository and lets you choose which to install into `.ai/skills`:

```shell
php laragram brain:add-skill owner/repository

php laragram brain:add-skill owner/repository --skill=creating-invoices

php laragram brain:add-skill owner/repository --all
```

Before anything is installed, Brain audits the downloaded files locally for patterns that are dangerous for an agent to follow, such as piping downloads into a shell, reading secrets, or prompt injection, and asks for confirmation when it finds any. The audit cannot prove that a skill is safe, so you should still review what you install. Use `--list` to only list the skills, `--force` to overwrite skills you already have, and `--skip-audit` to skip the audit.

GitHub limits unauthenticated API requests to 60 per hour. To raise the limit, set the `brain.github.token` (or `services.github.token`) configuration option to a GitHub token.

<a name="third-party-package-skills"></a>
### Third-Party Package Skills

If you maintain a third-party package and would like Brain to include skills for it, you can do so by adding a `resources/brain/skills/{skill-name}/SKILL.md` file to your package (a `SKILL.blade.php` file is rendered first, so a skill may adapt itself to the application it is installed in). When users of your package run `php laragram brain:install`, Brain will automatically install your skills based on user preference.

Brain Skills support the [Agent Skills format](https://agentskills.io/what-are-skills) and should be structured as a folder containing a `SKILL.md` file with YAML frontmatter and Markdown instructions. The `SKILL.md` file must include required frontmatter (`name` and `description`) and can optionally include scripts, templates, and reference materials.

Skills should outline any required file structure or conventions, and explain how to create or use its main features (with example commands or code snippets). Keep them concise, actionable, and focused on best practices so AI can generate correct code for your users:

```markdown
---
name: package-name-development
description: Build and work with PackageName features, including components and workflows.
---

# Package Name Development

## When to use this skill
Use this skill when working with PackageName features...

## Features

- Feature 1: [clear & short description].
- Feature 2: [clear & short description]. Example usage:

$result = PackageName::featureTwo($param1, $param2);
```

<a name="guidelines-vs-skills"></a>
## Guidelines vs. Skills

LaraGram Brain provides two distinct ways to give AI agents context about your application: **guidelines** and **skills**.

**Guidelines** are loaded upfront when the AI agent starts, providing essential context about LaraGram conventions and best practices that apply broadly across your codebase.

**Skills** are activated on-demand when working on specific tasks, containing detailed patterns for particular domains (like MTProto clients or Luna Mini Apps). Loading skills only when relevant reduces context bloat and improves code quality.

<div class="overflow-auto">

| Aspect      | Guidelines                        | Skills                           |
| ----------- | --------------------------------- | -------------------------------- |
| **Loaded**  | Upfront, always present           | On-demand, when relevant         |
| **Scope**   | Broad, foundational               | Focused, task-specific           |
| **Purpose** | Core conventions & best practices | Detailed implementation patterns |

</div>

Both guidelines and skills describe the LaraGram ecosystem. To capture the conventions of your own application, you should use [project rules](#project-rules).

<a name="project-rules"></a>
## Project Rules

While guidelines and skills teach agents how to write LaraGram, project rules teach them how to write your application. A rule is anything you would otherwise need to explain again in every new session:

<div class="content-list" markdown="1">

- Decisions made along the way by you, your agents, or your teammates.
- Style guidelines and preferences that are difficult to get an agent to follow.
- Traps and constraints that can't be inferred from the surrounding code.

</div>

Rules are stored as Markdown files within your application's `.ai/rules` directory and should be committed to source control. Unlike an agent's own memory, which is personal and session-scoped, your rules are shared with your team and with every agent that works on your application.

Each rule file declares the file globs it applies to within its frontmatter:

```markdown
---
paths:
  - listens/**
---

# Listens

## Reply through templates

Handlers never build message text inline with `sendMessage`. Every reply is a Temple8
template under `resources/templates`, so translations and formatting stay in one place.
```

In addition, Brain maintains an `.ai/rules/index.md` file which maps globs to their rule files. Agents are instructed to consult this index before planning or editing any file, so a rule is only loaded when it is relevant:

```markdown
# Project Rules Index

Before planning or editing, find the row whose globs match the file's path and read that rule file.

| Applies to | Rule file |
| --- | --- |
| listens/** | .ai/rules/listens.md |
| app/Models/** | .ai/rules/models.md |
```

> [!NOTE]
> Unlike the `.mcp.json` and generated guideline files, the `.ai/rules` directory should be committed to source control so that your rules are shared with your team.

<a name="recording-rules"></a>
### Recording Rules

To record a rule, you may simply ask your agent to remember it:

```text
Remember that all money values are stored as integer cents, never as floats.
```

The agent will invoke Brain's `record-rule` MCP tool with a `glob`, a short `title`, and a `note`. Brain will then file the rule under the matching area, creating the rule file if needed, and update the index.

You should always record rules using the `record-rule` tool rather than creating rule files by hand. Brain regenerates `.ai/rules/index.md` as part of recording a rule, and agents rely on that index to discover which rules apply to the file they are working on. A rule file that is added manually will not be discovered until the index is next regenerated.

<a name="inferring-your-applications-conventions"></a>
### Inferring Your Application's Conventions

Recording rules one at a time works well going forward; however, an existing application already contains plenty of conventions. The `infer-conventions` skill will bootstrap your rules from the code you have already written. To get started, ask your agent to use the skill:

```text
Use the infer-conventions skill
```

The skill will sweep your application across a checklist of LaraGram convention dimensions, including bot listens and replies, keyboards, templates, conversations, validation, web controllers, authorization, models, architecture, the web and Luna frontend, database, and console, followed by an open-ended pass for patterns such as base classes, shared traits, and module layouts.

The skill documents what your code actually does rather than what it should do. It records only well-supported, non-default conventions, skips framework defaults and anything your formatter or static-analysis tools (such as PHP-CS-Fixer, PHPStan or Rector) already enforce, and reports genuinely mixed patterns instead of recording them. Before writing any rules, the skill will present each convention it discovered, along with its supporting evidence, for your approval. If you would like the skill to record all discovered conventions without confirmation, you may tell it to "yolo".

<a name="disabling-project-rules"></a>
### Disabling Project Rules

Project rules are enabled by default. To disable them entirely, define the following environment variable. This removes the `record-rule` MCP tool and stops Brain from managing the `.ai/rules` directory:

```ini
BRAIN_RULES_ENABLED=false
```

<a name="documentation-search"></a>
<a name="documentation-api"></a>
## Documentation Search

The `Search Docs` MCP tool searches the LaraGram documentation without calling any external service. Brain ships the documentation of your installed LaraGram major version and indexes it locally, together with every method and type of the Telegram Bot API. Brain's AI guidelines and skills instruct your coding agent to search it before relying on what it remembers.

Results are limited to the packages installed in your application, and the agent may narrow a search to specific packages:

<div class="overflow-auto">

| Package                                   | Documentation                                   |
| ----------------------------------------- | ----------------------------------------------- |
| LaraGram Framework (`laraxgram/core`)     | Every page that does not belong to a package below |
| Laraquest (`laraxgram/laraquest`)         | Telegram Bot API methods and types              |
| MTProto (`laraxgram/mtproto`)             | The MTProto pages                               |
| Luna (`laraxgram/luna`, `@laraxgram/*`)   | Luna, Mini Apps, Vite, Frontend, Starter Kits and Precognition |
| Surge (`laraxgram/surge`)                 | Surge                                           |
| Watchdog (`laraxgram/watchdog`)           | Watchdog                                        |
| Tempora (`laraxgram/tempora`)             | Tempora                                         |

</div>

The framework documentation and the Bot API reference are always searched. To refresh the bundled documentation with the latest version of this site, or to see which copy is in use, run the `brain:docs` command:

```shell
php laragram brain:docs

php laragram brain:docs --update
```

The `--update` option downloads the documentation from the [LaraGram documentation repository](https://github.com/laraxgram/laraxgram.github.io) and stores it in `storage/framework/brain/docs`, where it takes precedence over the copy bundled with Brain.

<a name="extending-brain"></a>
## Extending Brain

Brain works with many popular IDEs and AI agents out of the box. If your coding tool isn't supported yet, you can create your own agent and integrate it with Brain.

<a name="adding-support-for-other-ides-ai-agents"></a>
### Adding Support for Other IDEs / AI Agents

To add support for a new IDE or AI agent, create a class that extends `LaraGram\Brain\Install\Agents\Agent` and implement one or more of the following contracts depending on what you need:

- `LaraGram\Brain\Contracts\SupportsGuidelines` - Adds support for AI guidelines.
- `LaraGram\Brain\Contracts\SupportsMcp` - Adds support for MCP.
- `LaraGram\Brain\Contracts\SupportsSkills` - Adds support for Agent Skills.

<a name="writing-the-agent"></a>
#### Writing the Agent

```php
<?php

declare(strict_types=1);

namespace App;

use LaraGram\Brain\Contracts\SupportsGuidelines;
use LaraGram\Brain\Contracts\SupportsMcp;
use LaraGram\Brain\Contracts\SupportsSkills;
use LaraGram\Brain\Install\Agents\Agent;

class CustomAgent extends Agent implements SupportsGuidelines, SupportsMcp, SupportsSkills
{
    // Your implementation...
}
```

For an example implementation, see [ClaudeCode.php](https://github.com/laraxgram/brain/blob/master/src/Install/Agents/ClaudeCode.php).

<a name="registering-the-agent"></a>
#### Registering the Agent

Register your custom agent in the `boot` method of your application's `App\Providers\AppServiceProvider`:

```php
use LaraGram\Brain\Brain;

public function boot(): void
{
    Brain::registerAgent('customagent', CustomAgent::class);
}
```

Once registered, your agent will be available for selection when running `php laragram brain:install`.
