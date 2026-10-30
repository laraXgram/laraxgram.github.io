# Facades

<a name="introduction"></a>
## Introduction

Throughout the LaraGram documentation, you will see examples of code that interacts with LaraGram's features via "facades". Facades provide a "static" interface to classes that are available in the application's [service container](/v4/container). LaraGram ships with many facades which provide access to almost all of LaraGram's features.

LaraGram facades serve as "static proxies" to underlying classes in the service container, providing the benefit of a terse, expressive syntax while maintaining more testability and flexibility than traditional static methods. It's perfectly fine if you don't totally understand how facades work - just go with the flow and continue learning about LaraGram.

All of LaraGram's facades are defined in the `LaraGram\Support\Facades` namespace. So, we can easily access a facade like so:

```php
use LaraGram\Support\Facades\Cache;
use LaraGram\Support\Facades\Bot;
use LaraGram\Request\Request;

Bot::onText('get', function (Request $request) {
    $cache = Cache::get('key');
    
    $request->sendMessage(chat()->id, $cache);
});
```

Throughout the LaraGram documentation, many of the examples will use facades to demonstrate various features of the framework.

<a name="helper-functions"></a>
#### Helper Functions

To complement facades, LaraGram offers a variety of global "helper functions" that make it even easier to interact with common LaraGram features. Some of the common helper functions you may interact with are `template`, `config`, `cache`, and more. Each helper function offered by LaraGram is documented with their corresponding feature; however, a complete list is available within the dedicated [helper documentation](/v4/helpers).

For example, instead of using the `LaraGram\Support\Facades\Cache` facade to read a data from cache, we may simply use the `cache` function. Because helper functions are globally available, you do not need to import any classes in order to use them:

```php
use LaraGram\Support\Facades\Cache;

Bot::onText('users', function () {
    $data = Cache::get('users');
    // ...
});

Bot::onText('users', function () {
    $data = cache()->get('users');
    // ...
});
```

<a name="when-to-use-facades"></a>
## When to Utilize Facades

Facades have many benefits. They provide a terse, memorable syntax that allows you to use LaraGram's features without remembering long class names that must be injected or configured manually. Furthermore, because of their unique usage of PHP's dynamic methods, they are easy to test.

However, some care must be taken when using facades. The primary danger of facades is class "scope creep". Since facades are so easy to use and do not require injection, it can be easy to let your classes continue to grow and use many facades in a single class. Using dependency injection, this potential is mitigated by the visual feedback a large constructor gives you that your class is growing too large. So, when using facades, pay special attention to the size of your class so that its scope of responsibility stays narrow. If your class is getting too large, consider splitting it into multiple smaller classes.

<a name="facades-vs-dependency-injection"></a>
### Facades vs. Dependency Injection

One of the primary benefits of dependency injection is the ability to swap implementations of the injected class. This is useful during testing since you can inject a mock or stub and assert that various methods were called on the stub.

Typically, it would not be possible to mock or stub a truly static class method. However, since facades use dynamic methods to proxy method calls to objects resolved from the service container, we actually can test facades just as we would test an injected class instance. For example, given the following listen:

```php
use LaraGram\Support\Facades\Cache;

Bot::onText('cache', function () {
    $data = Cache::get('key');
});
```

<a name="facades-vs-helper-functions"></a>
### Facades vs. Helper Functions

In addition to facades, LaraGram includes a variety of "helper" functions which can perform common tasks like generating views, firing events, dispatching jobs, or sending Bot responses. Many of these helper functions perform the same function as a corresponding facade. For example, this facade call and helper call are equivalent:

```php
$profile = LaraGram\Support\Facades\Template::make('profile');

$profile = template('profile');
```

There is absolutely no practical difference between facades and helper functions. When using helper functions, you may still test them exactly as you would the corresponding facade. For example, given the following listen:

```php
Bot::onText('cache', function () {
    $data =  cache('key');
});
```

The `cache` helper is going to call the `get` method on the class underlying the `Cache` facade. So, even though we are using the helper function, we can write the following test to verify that the method was called with the argument we expected:

<a name="how-facades-work"></a>
## How Facades Work

In a LaraGram application, a facade is a class that provides access to an object from the container. The machinery that makes this work is in the `Facade` class. LaraGram's facades, and any custom facades you create, will extend the base `LaraGram\Support\Facades\Facade` class.

The `Facade` base class makes use of the `__callStatic()` magic-method to defer calls from your facade to an object resolved from the container. In the example below, a call is made to the LaraGram cache system. By glancing at this code, one might assume that the static `get` method is being called on the `Cache` class:

```php
<?php

namespace App\Controllers;

use LaraGram\Support\Facades\Cache;

class UserController extends Controller
{
    /**
     * Show the profile for the given user.
     */
    public function showProfile(string $id)
    {
        $user = Cache::get('user:'.$id);

        template('profile', ['user' => $user]);
    }
}
```

Notice that near the top of the file we are "importing" the `Cache` facade. This facade serves as a proxy for accessing the underlying implementation of the `LaraGram\Contracts\Cache\Factory` interface. Any calls we make using the facade will be passed to the underlying instance of LaraGram's cache service.

If we look at that `LaraGram\Support\Facades\Cache` class, you'll see that there is no static method `get`:

```php
class Cache extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor(): string
    {
        return 'cache';
    }
}
```

Instead, the `Cache` facade extends the base `Facade` class and defines the method `getFacadeAccessor()`. This method's job is to return the name of a service container binding. When a user references any static method on the `Cache` facade, LaraGram resolves the `cache` binding from the [service container](/v4/container) and runs the requested method (in this case, `get`) against that object.

<a name="real-time-facades"></a>
## Real-Time Facades

Using real-time facades, you may treat any class in your application as if it was a facade. To illustrate how this can be used, let's first examine some code that does not use real-time facades. For example, let's assume our `Podcast` model has a `publish` method. However, in order to publish the podcast, we need to inject a `Publisher` instance:

```php
<?php

namespace App\Models;

use App\Contracts\Publisher;
use LaraGram\Database\Eloquent\Model;

class Podcast extends Model
{
    /**
     * Publish the podcast.
     */
    public function publish(Publisher $publisher): void
    {
        $this->update(['publishing' => now()]);

        $publisher->publish($this);
    }
}
```

Injecting a publisher implementation into the method allows us to easily test the method in isolation since we can mock the injected publisher. However, it requires us to always pass a publisher instance each time we call the `publish` method. Using real-time facades, we can maintain the same testability while not being required to explicitly pass a `Publisher` instance. To generate a real-time facade, prefix the namespace of the imported class with `Facades`:

```php
<?php

namespace App\Models;

use App\Contracts\Publisher; // [!code --]
use Facades\App\Contracts\Publisher; // [!code ++]
use LaraGram\Database\Eloquent\Model;

class Podcast extends Model
{
    /**
     * Publish the podcast.
     */
    public function publish(Publisher $publisher): void // [!code --]
    public function publish(): void // [!code ++]
    {
        $this->update(['publishing' => now()]);

        $publisher->publish($this); // [!code --]
        Publisher::publish($this); // [!code ++]
    }
}
```

When the real-time facade is used, the publisher implementation will be resolved out of the service container using the portion of the interface or class name that appears after the `Facades` prefix.

<a name="facade-class-reference"></a>
## Facade Class Reference

Below you will find every facade and its underlying class. This is a useful tool for quickly digging into the API documentation for a given facade root. The [service container binding](/v4/container) key is also included where applicable.

<div class="overflow-auto">

| Facade                | Class                                                                                                                                 | Service Container Binding |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| App                   | [LaraGram\Foundation\Application](https://github.com/laraxgram/core/blob/4.x.x/src/Foundation/Application.php)                     | `app`                     |
| Commander             | [LaraGram\Contracts\Console\Kernel](https://github.com/laraxgram/core/blob/4.x.x/src/Contracts/Console/Kernel.php)                 | `laragram`                |
| Auth                  | [LaraGram\Auth\AuthManager](https://github.com/laraxgram/core/blob/4.x.x/src/Auth/AuthManager.php)                                 | `auth`                    |
| Bot                   | [LaraGram\Listening\Listener](https://github.com/laraxgram/core/blob/4.x.x/src/Listening/Listener.php)                             | `listener`                |
| Bus                   | [LaraGram\Contracts\Bus\Dispatcher](https://github.com/laraxgram/core/blob/4.x.x/src/Contracts/Bus/Dispatcher.php)                 | &nbsp;                    |
| Cache (Instance)      | [LaraGram\Cache\Repository](https://github.com/laraxgram/core/blob/4.x.x/src/Cache/Repository.php)                                 | `cache.store`             |
| Cache                 | [LaraGram\Cache\CacheManager](https://github.com/laraxgram/core/blob/4.x.x/src/Cache/CacheManager.php)                             | `cache`                   |
| Config                | [LaraGram\Config\Repository](https://github.com/laraxgram/core/blob/4.x.x/src/Config/Repository.php)                               | `config`                  |
| Context               | [LaraGram\Log\Context\Repository](https://github.com/laraxgram/core/blob/4.x.x/src/Log/Context/Repository.php)                     | &nbsp;                    |
| Crypt                 | [LaraGram\Encryption\Encrypter](https://github.com/laraxgram/core/blob/4.x.x/src/Encryption/Encrypter.php)                         | `encrypter`               |
| Date                  | [LaraGram\Support\DateFactory](https://github.com/laraxgram/core/blob/4.x.x/src/Support/DateFactory.php)                           | `date`                    |
| DB (Instance)         | [LaraGram\Database\Connection](https://github.com/laraxgram/core/blob/4.x.x/src/Database/Connection.php)                           | `db.connection`           |
| DB                    | [LaraGram\Database\DatabaseManager](https://github.com/laraxgram/core/blob/4.x.x/src/Database/DatabaseManager.php)                 | `db`                      |
| Event                 | [LaraGram\Events\Dispatcher](https://github.com/laraxgram/core/blob/4.x.x/src/Events/Dispatcher.php)                               | `events`                  |
| Exceptions (Instance) | [LaraGram\Contracts\Debug\ExceptionHandler](https://github.com/laraxgram/core/blob/4.x.x/src/Contracts/Debug/ExceptionHandler.php) | &nbsp;                    |
| Exceptions            | [LaraGram\Foundation\Exceptions\Handler](https://github.com/laraxgram/core/blob/4.x.x/src/Foundation/Exceptions/Handler.php)       | &nbsp;                    |
| File                  | [LaraGram\Filesystem\Filesystem](https://github.com/laraxgram/core/blob/4.x.x/src/Filesystem/Filesystem.php)                       | `files`                   |
| Gate                  | [LaraGram\Contracts\Auth\Access\Gate](https://github.com/laraxgram/core/blob/4.x.x/src/Contracts/Auth/Access/Gate.php)             | &nbsp;                    |
| Hash                  | [LaraGram\Contracts\Hashing\Hasher](https://github.com/laraxgram/core/blob/4.x.x/src/Contracts/Hashing/Hasher.php)                 | `hash`                    |
| Image                 | [LaraGram\Image\ImageManager](https://github.com/laraxgram/core/blob/4.x.x/src/Image/ImageManager.php)                             | `image`                   |
| Lang                  | [LaraGram\Translation\Translator](https://github.com/laraxgram/core/blob/4.x.x/src/Translation/Translator.php)                     | `translator`              |
| Log                   | [LaraGram\Log\LogManager](https://github.com/laraxgram/core/blob/4.x.x/src/Log/LogManager.php)                                     | `log`                     |
| Pipeline (Instance)   | [LaraGram\Pipeline\Pipeline](https://github.com/laraxgram/core/blob/4.x.x/src/Pipeline/Pipeline.php)                               | &nbsp;                    |
| Process               | [LaraGram\Process\Factory](https://github.com/laraxgram/core/blob/4.x.x/src/Process/Factory.php)                                   | &nbsp;                    |
| Queue (Base Class)    | [LaraGram\Queue\Queue](https://github.com/laraxgram/core/blob/4.x.x/src/Queue/Queue.php)                                           | &nbsp;                    |
| Queue (Instance)      | [LaraGram\Contracts\Queue\Queue](https://github.com/laraxgram/core/blob/4.x.x/src/Contracts/Queue/Queue.php)                       | `queue.connection`        |
| Queue                 | [LaraGram\Queue\QueueManager](https://github.com/laraxgram/core/blob/4.x.x/src/Queue/QueueManager.php)                             | `queue`                   |
| RateLimiter           | [LaraGram\Cache\RateLimiter](https://github.com/laraxgram/core/blob/4.x.x/src/Cache/RateLimiter.php)                               | &nbsp;                    |
| Redirect              | [LaraGram\Listening\Redirector](https://github.com/laraxgram/core/blob/4.x.x/src/Listening/Redirector.php)                         | `redirect`                |
| Redis (Instance)      | [LaraGram\Redis\Connections\Connection](https://github.com/laraxgram/core/blob/4.x.x/src/Redis/Connections/Connection.php)         | `redis.connection`        |
| Redis                 | [LaraGram\Redis\RedisManager](https://github.com/laraxgram/core/blob/4.x.x/src/Redis/RedisManager.php)                             | `redis`                   |
| Request               | [LaraGram\Request\Request](https://github.com/laraxgram/core/blob/4.x.x/src/Request/Request.php)                                      | `request`                 |
| Schedule              | [LaraGram\Console\Scheduling\Schedule](https://github.com/laraxgram/core/blob/4.x.x/src/Console/Scheduling/Schedule.php)           | &nbsp;                    |
| Schema                | [LaraGram\Database\Schema\Builder](https://github.com/laraxgram/core/blob/4.x.x/src/Database/Schema/Builder.php)                   | &nbsp;                    |
| Storage (Instance)    | [LaraGram\Contracts\Filesystem\Filesystem](https://github.com/laraxgram/core/blob/4.x.x/src/Contracts/Filesystem/Filesystem.php)   | `filesystem.disk`         |
| Storage               | [LaraGram\Filesystem\FilesystemManager](https://github.com/laraxgram/core/blob/4.x.x/src/Filesystem/FilesystemManager.php)         | `filesystem`              |
| Validator (Instance)  | [LaraGram\Validation\Validator](https://github.com/laraxgram/core/blob/4.x.x/src/Validation/Validator.php)                         | &nbsp;                    |
| Validator             | [LaraGram\Validation\Factory](https://github.com/laraxgram/core/blob/4.x.x/src/Validation/Factory.php)                             | `validator`               |
| Template              | [LaraGram\Template\Factory](https://github.com/laraxgram/core/blob/4.x.x/src/Template/Factory.php)                                     | `template`                |

</div>
