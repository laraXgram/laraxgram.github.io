# Error Handling

<a name="introduction"></a>
## Introduction

When you start a new LaraGram project, error and exception handling is already configured for you; however, at any point, you may use the `withExceptions` method in your application's `bootstrap/app.php` to manage how exceptions are reported and rendered by your application.

The `$exceptions` object provided to the `withExceptions` closure is an instance of `LaraGram\Foundation\Configuration\Exceptions` and is responsible for managing exception handling in your application. We'll dive deeper into this object throughout this documentation.

<a name="configuration"></a>
## Configuration

The `debug` option in your `config/app.php` configuration file determines how much information about an error is actually displayed to the user. By default, this option is set to respect the value of the `APP_DEBUG` environment variable, which is stored in your `.env` file.

During local development, you should set the `APP_DEBUG` environment variable to `true`. **In your production environment, this value should always be `false`. If the value is set to `true` in production, you risk exposing sensitive configuration values to your application's end users.**

<a name="handling-exceptions"></a>
## Handling Exceptions

<a name="reporting-exceptions"></a>
### Reporting Exceptions

In LaraGram, exception reporting is used to log exceptions. By default, exceptions will be logged based on your [logging](/src/logging.mdg.md) configuration. However, you are free to log exceptions however you wish.

If you need to report different types of exceptions in different ways, you may use the `report` exception method in your application's `bootstrap/app.php` to register a closure that should be executed when an exception of a given type needs to be reported. LaraGram will determine what type of exception the closure reports by examining the type-hint of the closure:

```php
use App\Exceptions\InvalidOrderException;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->report(function (InvalidOrderException $e) {
        // ...
    });
})
```

When you register a custom exception reporting callback using the `report` method, LaraGram will still log the exception using the default logging configuration for the application. If you wish to stop the propagation of the exception to the default logging stack, you may use the `stop` method when defining your reporting callback or return `false` from the callback:

```php
use App\Exceptions\InvalidOrderException;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->report(function (InvalidOrderException $e) {
        // ...
    })->stop();

    $exceptions->report(function (InvalidOrderException $e) {
        return false;
    });
})
```

> [!NOTE]
> To customize the exception reporting for a given exception, you may also utilize [reportable exceptions](/src/errors.mds.md#renderable-exceptions).

<a name="global-log-context"></a>
#### Global Log Context

If available, LaraGram automatically adds the current user's ID to every exception's log message as contextual data. You may define your own global contextual data using the `context` exception method in your application's `bootstrap/app.php` file. This information will be included in every exception's log message written by your application:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->context(fn () => [
        'foo' => 'bar',
    ]);
})
```

<a name="exception-log-context"></a>
#### Exception Log Context

While adding context to every log message can be useful, sometimes a particular exception may have unique context that you would like to include in your logs. By defining a `context` method on one of your application's exceptions, you may specify any data relevant to that exception that should be added to the exception's log entry:

```php
<?php

namespace App\Exceptions;

use Exception;

class InvalidOrderException extends Exception
{
    // ...

    /**
     * Get the exception's context information.
     *
     * @return array<string, mixed>
     */
    public function context(): array
    {
        return ['order_id' => $this->orderId];
    }
}
```

<a name="the-report-helper"></a>
#### The `report` Helper

Sometimes you may need to report an exception but continue handling the current request. The `report` helper function allows you to quickly report an exception without rendering an error page to the user:

```php
public function isValid(string $value): bool
{
    try {
        // Validate the value...
    } catch (Throwable $e) {
        report($e);

        return false;
    }
}
```

<a name="deduplicating-reported-exceptions"></a>
#### Deduplicating Reported Exceptions

If you are using the `report` function throughout your application, you may occasionally report the same exception multiple times, creating duplicate entries in your logs.

If you would like to ensure that a single instance of an exception is only ever reported once, you may invoke the `dontReportDuplicates` exception method in your application's `bootstrap/app.php` file:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->dontReportDuplicates();
})
```

Now, when the `report` helper is called with the same instance of an exception, only the first call will be reported:

```php
$original = new RuntimeException('Whoops!');

report($original); // reported

try {
    throw $original;
} catch (Throwable $caught) {
    report($caught); // ignored
}

report($original); // ignored
report($caught); // ignored
```

<a name="exception-log-levels"></a>
### Exception Log Levels

When messages are written to your application's [logs](/src/logging.mdg.md), the messages are written at a specified [log level](/src/logging.mdg.md#log-levels), which indicates the severity or importance of the message being logged.

As noted above, even when you register a custom exception reporting callback using the `report` method, LaraGram will still log the exception using the default logging configuration for the application; however, since the log level can sometimes influence the channels on which a message is logged, you may wish to configure the log level that certain exceptions are logged at.

To accomplish this, you may use the `level` exception method in your application's `bootstrap/app.php` file. This method receives the exception type as its first argument and the log level as its second argument:

```php
use PDOException;
use Psr\Log\LogLevel;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->level(PDOException::class, LogLevel::CRITICAL);
})
```

<a name="ignoring-exceptions-by-type"></a>
### Ignoring Exceptions by Type

When building your application, there will be some types of exceptions you never want to report. To ignore these exceptions, you may use the `dontReport` exception method in your application's `bootstrap/app.php` file. Any class provided to this method will never be reported; however, they may still have custom rendering logic:

```php
use App\Exceptions\InvalidOrderException;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->dontReport([
        InvalidOrderException::class,
    ]);
})
```

Alternatively, you may simply "mark" an exception class with the `LaraGram\Contracts\Debug\ShouldntReport` interface. When an exception is marked with this interface, it will never be reported by LaraGram's exception handler:

```php
<?php

namespace App\Exceptions;

use Exception;
use LaraGram\Contracts\Debug\ShouldntReport;

class PodcastProcessingException extends Exception implements ShouldntReport
{
    //
}
```

If you would like to instruct LaraGram to stop ignoring a given type of exception, you may use the `stopIgnoring` exception method in your application's `bootstrap/app.php` file:

```php
use App\Exceptions\MyException;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->stopIgnoring(MyException::class);
})
```

<a name="reportable-exceptions"></a>
### Reportable Exceptions

Instead of defining custom reporting behavior in your application's `bootstrap/app.php` file, you may define `report` methods directly on your application's exceptions. When these methods exist, they will automatically be called by the framework:

```php
<?php

namespace App\Exceptions;

use Exception;

class InvalidOrderException extends Exception
{
    /**
     * Report the exception.
     */
    public function report(): void
    {
        // ...
    }
}
```

If your exception contains custom reporting logic that is only necessary when certain conditions are met, you may need to instruct LaraGram to sometimes report the exception using the default exception handling configuration. To accomplish this, you may return `false` from the exception's `report` method:

```php
/**
 * Report the exception.
 */
public function report(): bool
{
    if (/** Determine if the exception needs custom reporting */) {

        // ...

        return true;
    }

    return false;
}
```

> [!NOTE]
> You may type-hint any required dependencies of the `report` method and they will automatically be injected into the method by LaraGram's [service container](/src/container.mdr.md).

<a name="throttling-reported-exceptions"></a>
### Throttling Reported Exceptions

If your application reports a very large number of exceptions, you may want to throttle how many exceptions are actually logged or sent to your application's external error tracking service.

To take a random sample rate of exceptions, you may use the `throttle` exception method in your application's `bootstrap/app.php` file. The `throttle` method receives a closure that should return a `Lottery` instance:

```php
use LaraGram\Support\Lottery;
use Throwable;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->throttle(function (Throwable $e) {
        return Lottery::odds(1, 1000);
    });
})
```

It is also possible to conditionally sample based on the exception type. If you would like to only sample instances of a specific exception class, you may return a `Lottery` instance only for that class:

```php
use App\Exceptions\ApiMonitoringException;
use LaraGram\Support\Lottery;
use Throwable;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->throttle(function (Throwable $e) {
        if ($e instanceof ApiMonitoringException) {
            return Lottery::odds(1, 1000);
        }
    });
})
```

You may also rate limit exceptions logged or sent to an external error tracking service by returning a `Limit` instance instead of a `Lottery`. This is useful if you want to protect against sudden bursts of exceptions flooding your logs, for example, when a third-party service used by your application is down:

```php
use LaraGram\Broadcasting\BroadcastException;
use LaraGram\Cache\RateLimiting\Limit;
use Throwable;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->throttle(function (Throwable $e) {
        if ($e instanceof BroadcastException) {
            return Limit::perMinute(300);
        }
    });
})
```

By default, limits will use the exception's class as the rate limit key. You can customize this by specifying your own key using the `by` method on the `Limit`:

```php
use LaraGram\Broadcasting\BroadcastException;
use LaraGram\Cache\RateLimiting\Limit;
use Throwable;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->throttle(function (Throwable $e) {
        if ($e instanceof BroadcastException) {
            return Limit::perMinute(300)->by($e->getMessage());
        }
    });
})
```

Of course, you may return a mixture of `Lottery` and `Limit` instances for different exceptions:

```php
use App\Exceptions\ApiMonitoringException;
use LaraGram\Cache\RateLimiting\Limit;
use LaraGram\Support\Lottery;
use Throwable;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->throttle(function (Throwable $e) {
        return match (true) {
            $e instanceof ApiMonitoringException => Lottery::odds(1, 1000),
            default => Limit::none(),
        };
    });
})
```
