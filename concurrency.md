# Concurrency

- [Introduction](#introduction)
- [Running Concurrent Tasks](#running-concurrent-tasks)
- [Deferring Concurrent Tasks](#deferring-concurrent-tasks)

<a name="introduction"></a>
## Introduction

Sometimes you may need to execute several slow tasks which do not depend on one another. In many cases, significant performance improvements can be realized by executing the tasks concurrently. LaraGram's `Concurrency` facade provides a simple, convenient API for executing closures concurrently.

<a name="how-it-works"></a>
#### How it Works

LaraGram achieves concurrency by serializing the given closures and dispatching them to a hidden Commander CLI command, which unserializes the closures and invokes it within its own PHP process. After the closure has been invoked, the resulting value is serialized back to the parent process.

The `Concurrency` facade supports three drivers: `process` (the default), and `sync`.

The `sync` driver is primarily useful during testing when you want to disable all concurrency and simply execute the given closures in sequence within the parent process.

<a name="running-concurrent-tasks"></a>
## Running Concurrent Tasks

To run concurrent tasks, you may invoke the `Concurrency` facade's `run` method. The `run` method accepts an array of closures which should be executed simultaneously in child PHP processes:

```php
use LaraGram\Support\Facades\Concurrency;
use LaraGram\Support\Facades\DB;

[$userCount, $orderCount] = Concurrency::run([
    fn () => DB::table('users')->count(),
    fn () => DB::table('orders')->count(),
]);
```

To use a specific driver, you may use the `driver` method:

```php
$results = Concurrency::driver('process')->run(...);
```

Or, to change the default concurrency driver, you should publish the `concurrency` configuration file via the `config:publish` Commander command and update the `default` option within the file:

```shell
php laragram config:publish concurrency
```

<a name="deferring-concurrent-tasks"></a>
## Deferring Concurrent Tasks

If you would like to execute an array of closures concurrently, but are not interested in the results returned by those closures, you should consider using the `defer` method. When the `defer` method is invoked, the given closures are not executed immediately. Instead, LaraGram will execute the closures concurrently after the Bot response has been sent to the user:

```php
use App\Services\Metrics;
use LaraGram\Support\Facades\Concurrency;

Concurrency::defer([
    fn () => Metrics::report('users'),
    fn () => Metrics::report('orders'),
]);
```
