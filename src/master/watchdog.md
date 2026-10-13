# LaraGram Watchdog

<a name="introduction"></a>
## Introduction

[Watchdog](https://github.com/laraXgram/Watchdog) is a pre-built package for managing logs and real-time reports.

Watchdog can display logs in real time on your terminal, report to a Telegram chat for you, and also create a panel for you to read logs and manage them in Telegram.

<a name="installation"></a>
## Installation

Watchdog is installed by default with Laragram, however you can easily install it with Composer:

```shell
composer require laraxgram/watchdog
```

#### Publishing assets

```shell
php laragram vendor:publish --tag=watchdog-config
```

If you use composer dev, the watchdog will also run automatically, but you can run it manually with the following command:
```shell
php laragram watchdog
```

From now on, logs will be reported to you in real time.

<a name="configuration"></a>
## Configuration

### CLI Log Capture

This feature, when enabled, will display logs in the terminal for you:

```php
'cli' => [
   'enabled' => true,
   'levels' => ['*']
],
```

> [!INFO]
> Log levels can be any of the following, `*` meaning all of them.
> 
> `DEBUG`, `INFO`, `NOTICE`, `WARNING`, `ERROR`, `CRITICAL`, `ALERT`, `EMERGENCY`

### Automatic Log Reporting

This feature is more suitable in a production environment. In the event of an error, a bot message is sent instantly to the specified chats in Telegram:

```php
'report' => [
    'enabled' => false,
    'chats' => [
        // chat_id of the chats to which logs should be reported.
    ],
    'levels' => ['*'],
    'connection' => null, // Bot connection for sending reports (null uses the default connection)
    'repeat' => [
        'enabled' => true,
        'store' => null, // Cache store for the last report (null uses the default cache store)
    ],
],
```

> [!INFO]
> Log levels can be any of the following, `*` meaning all of them.
>
> `DEBUG`, `INFO`, `NOTICE`, `WARNING`, `ERROR`, `CRITICAL`, `ALERT`, `EMERGENCY`

Each report includes the level, message, time, exception type and file, user ID, origin (command, queue and job), the log context, previous exceptions, and the stack trace. Long reports are shortened to fit in a single Telegram message, trimming the stack trace first.

#### Repeated Logs

When the same log is reported several times in a row, Watchdog does not send a new message for each one. The first report is sent, and every repeat edits it with a counter and the time it was first and last seen. As soon as a different log is reported, the counter ends: if the previous log happens again, it is sent as a new message and counted from the beginning.

The last report and its message IDs are kept in the cache. You may choose the cache store with `repeat.store`, or turn counting off by setting `repeat.enabled` to `false`.

### Log Manager Access

This feature sends you an admin panel in Telegram where you can open the created log files, navigate between logs, or even delete them without direct access to the server.

The panel reads files written by both the default line formatter and the JSON formatter, with any channel name, and shows every log level. Each entry shows its message, context, extra data, exception, previous exceptions, and stack trace.

```php
'manager' => [
    'enabled' => true,
    'command' => 'log', // Panel send command (default `/log`)
    'admins' => [
        // user_id of users who have permission to access the panel.
    ]
],
```