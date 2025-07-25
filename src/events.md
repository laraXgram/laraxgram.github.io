# Events

<a name="introduction"></a>
## Introduction

LaraGram's events provide a simple observer pattern implementation, allowing you to subscribe and listen for various events that occur within your application. Event classes are typically stored in the `app/Events` directory, while their listeners are stored in `app/Listeners`. Don't worry if you don't see these directories in your application as they will be created for you as you generate events and listeners using Commander console commands.

Events serve as a great way to decouple various aspects of your application, since a single event can have multiple listeners that do not depend on each other. For example, you may wish to send a Slack notification to your user each time an order has shipped. Instead of coupling your order processing code to your Slack notification code, you can raise an `App\Events\OrderShipped` event which a listener can receive and use to dispatch a Slack notification.

<a name="generating-events-and-listeners"></a>
## Generating Events and Listeners

To quickly generate events and listeners, you may use the `make:event` and `make:listener` Commander commands:

```shell
php laragram make:event PodcastProcessed

php laragram make:listener SendPodcastNotification --event=PodcastProcessed
```

For convenience, you may also invoke the `make:event` and `make:listener` Commander commands without additional arguments. When you do so, LaraGram will automatically prompt you for the class name and, when creating a listener, the event it should listen to:

```shell
php laragram make:event

php laragram make:listener
```

<a name="registering-events-and-listeners"></a>
## Registering Events and Listeners

<a name="event-discovery"></a>
### Event Discovery

By default, LaraGram will automatically find and register your event listeners by scanning your application's `Listeners` directory. When LaraGram finds any listener class method that begins with `handle` or `__invoke`, LaraGram will register those methods as event listeners for the event that is type-hinted in the method's signature:

```php
use App\Events\PodcastProcessed;

class SendPodcastNotification
{
    /**
     * Handle the event.
     */
    public function handle(PodcastProcessed $event): void
    {
        // ...
    }
}
```

You may listen to multiple events using PHP's union types:

```php
/**
 * Handle the event.
 */
public function handle(PodcastProcessed|PodcastPublished $event): void
{
    // ...
}
```

If you plan to store your listeners in a different directory or within multiple directories, you may instruct LaraGram to scan those directories using the `withEvents` method in your application's `bootstrap/app.php` file:

```php
->withEvents(discover: [
    __DIR__.'/../app/Domain/Orders/Listeners',
])
```

You may scan for listeners in multiple similar directories using the `*` character as a wildcard:

```php
->withEvents(discover: [
    __DIR__.'/../app/Domain/*/Listeners',
])
```

The `event:list` command may be used to list all of the listeners registered within your application:

```shell
php laragram event:list
```

<a name="event-discovery-in-production"></a>
#### Event Discovery in Production

To give your application a speed boost, you should cache a manifest of all of your application's listeners using the `optimize` or `event:cache` Commander commands. Typically, this command should be run as part of your application's [deployment process](/deployment.md#optimization). This manifest will be used by the framework to speed up the event registration process. The `event:clear` command may be used to destroy the event cache.

<a name="manually-registering-events"></a>
### Manually Registering Events

Using the `Event` facade, you may manually register events and their corresponding listeners within the `boot` method of your application's `AppServiceProvider`:

```php
use App\Domain\Orders\Events\PodcastProcessed;
use App\Domain\Orders\Listeners\SendPodcastNotification;
use LaraGram\Support\Facades\Event;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Event::listen(
        PodcastProcessed::class,
        SendPodcastNotification::class,
    );
}
```

The `event:list` command may be used to list all of the listeners registered within your application:

```shell
php laragram event:list
```

<a name="closure-listeners"></a>
### Closure Listeners

Typically, listeners are defined as classes; however, you may also manually register closure-based event listeners in the `boot` method of your application's `AppServiceProvider`:

```php
use App\Events\PodcastProcessed;
use LaraGram\Support\Facades\Event;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Event::listen(function (PodcastProcessed $event) {
        // ...
    });
}
```

<a name="queuable-anonymous-event-listeners"></a>
#### Queueable Anonymous Event Listeners

When registering closure-based event listeners, you may wrap the listener closure within the `LaraGram\Events\queueable` function to instruct LaraGram to execute the listener using the [queue](/queues.md):

```php
use App\Events\PodcastProcessed;
use function LaraGram\Events\queueable;
use LaraGram\Support\Facades\Event;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Event::listen(queueable(function (PodcastProcessed $event) {
        // ...
    }));
}
```

Like queued jobs, you may use the `onConnection`, `onQueue`, and `delay` methods to customize the execution of the queued listener:

```php
Event::listen(queueable(function (PodcastProcessed $event) {
    // ...
})->onConnection('redis')->onQueue('podcasts')->delay(now()->addSeconds(10)));
```

If you would like to handle anonymous queued listener failures, you may provide a closure to the `catch` method while defining the `queueable` listener. This closure will receive the event instance and the `Throwable` instance that caused the listener's failure:

```php
use App\Events\PodcastProcessed;
use function LaraGram\Events\queueable;
use LaraGram\Support\Facades\Event;
use Throwable;

Event::listen(queueable(function (PodcastProcessed $event) {
    // ...
})->catch(function (PodcastProcessed $event, Throwable $e) {
    // The queued listener failed...
}));
```

<a name="wildcard-event-listeners"></a>
#### Wildcard Event Listeners

You may also register listeners using the `*` character as a wildcard parameter, allowing you to catch multiple events on the same listener. Wildcard listeners receive the event name as their first argument and the entire event data array as their second argument:

```php
Event::listen('event.*', function (string $eventName, array $data) {
    // ...
});
```

<a name="defining-events"></a>
## Defining Events

An event class is essentially a data container which holds the information related to the event. For example, let's assume an `App\Events\OrderShipped` event receives an [Eloquent ORM](/eloquent.md) object:

```php
<?php

namespace App\Events;

use App\Models\Order;
use LaraGram\Broadcasting\InteractsWithSockets;
use LaraGram\Foundation\Events\Dispatchable;
use LaraGram\Queue\SerializesModels;

class OrderShipped
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Order $order,
    ) {}
}
```

As you can see, this event class contains no logic. It is a container for the `App\Models\Order` instance that was purchased. The `SerializesModels` trait used by the event will gracefully serialize any Eloquent models if the event object is serialized using PHP's `serialize` function, such as when utilizing [queued listeners](#queued-event-listeners).

<a name="defining-listeners"></a>
## Defining Listeners

Next, let's take a look at the listener for our example event. Event listeners receive event instances in their `handle` method. The `make:listener` Commander command, when invoked with the `--event` option, will automatically import the proper event class and type-hint the event in the `handle` method. Within the `handle` method, you may perform any actions necessary to respond to the event:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;

class SendShipmentNotification
{
    /**
     * Create the event listener.
     */
    public function __construct() {}

    /**
     * Handle the event.
     */
    public function handle(OrderShipped $event): void
    {
        // Access the order using $event->order...
    }
}
```

> [!NOTE]
> Your event listeners may also type-hint any dependencies they need on their constructors. All event listeners are resolved via the LaraGram [service container](/container.md), so dependencies will be injected automatically.

<a name="stopping-the-propagation-of-an-event"></a>
#### Stopping The Propagation Of An Event

Sometimes, you may wish to stop the propagation of an event to other listeners. You may do so by returning `false` from your listener's `handle` method.

<a name="queued-event-listeners"></a>
## Queued Event Listeners

Queueing listeners can be beneficial if your listener is going to perform a slow task such as sending an email or making an HTTP request. Before using queued listeners, make sure to [configure your queue](/queues.md) and start a queue worker on your server or local development environment.

To specify that a listener should be queued, add the `ShouldQueue` interface to the listener class. Listeners generated by the `make:listener` Commander commands already have this interface imported into the current namespace so you can use it immediately:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use LaraGram\Contracts\Queue\ShouldQueue;

class SendShipmentNotification implements ShouldQueue
{
    // ...
}
```

That's it! Now, when an event handled by this listener is dispatched, the listener will automatically be queued by the event dispatcher using LaraGram's [queue system](/queues.md). If no exceptions are thrown when the listener is executed by the queue, the queued job will automatically be deleted after it has finished processing.

<a name="customizing-the-queue-connection-queue-name"></a>
#### Customizing The Queue Connection, Name, & Delay

If you would like to customize the queue connection, queue name, or queue delay time of an event listener, you may define the `$connection`, `$queue`, or `$delay` properties on your listener class:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use LaraGram\Contracts\Queue\ShouldQueue;

class SendShipmentNotification implements ShouldQueue
{
    /**
     * The name of the connection the job should be sent to.
     *
     * @var string|null
     */
    public $connection = 'sqs';

    /**
     * The name of the queue the job should be sent to.
     *
     * @var string|null
     */
    public $queue = 'listeners';

    /**
     * The time (seconds) before the job should be processed.
     *
     * @var int
     */
    public $delay = 60;
}
```

If you would like to define the listener's queue connection, queue name, or delay at runtime, you may define `viaConnection`, `viaQueue`, or `withDelay` methods on the listener:

```php
/**
 * Get the name of the listener's queue connection.
 */
public function viaConnection(): string
{
    return 'sqs';
}

/**
 * Get the name of the listener's queue.
 */
public function viaQueue(): string
{
    return 'listeners';
}

/**
 * Get the number of seconds before the job should be processed.
 */
public function withDelay(OrderShipped $event): int
{
    return $event->highPriority ? 0 : 60;
}
```

<a name="conditionally-queueing-listeners"></a>
#### Conditionally Queueing Listeners

Sometimes, you may need to determine whether a listener should be queued based on some data that are only available at runtime. To accomplish this, a `shouldQueue` method may be added to a listener to determine whether the listener should be queued. If the `shouldQueue` method returns `false`, the listener will not be queued:

```php
<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use LaraGram\Contracts\Queue\ShouldQueue;

class RewardGiftCard implements ShouldQueue
{
    /**
     * Reward a gift card to the customer.
     */
    public function handle(OrderCreated $event): void
    {
        // ...
    }

    /**
     * Determine whether the listener should be queued.
     */
    public function shouldQueue(OrderCreated $event): bool
    {
        return $event->order->subtotal >= 5000;
    }
}
```

<a name="manually-interacting-with-the-queue"></a>
### Manually Interacting With the Queue

If you need to manually access the listener's underlying queue job's `delete` and `release` methods, you may do so using the `LaraGram\Queue\InteractsWithQueue` trait. This trait is imported by default on generated listeners and provides access to these methods:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use LaraGram\Contracts\Queue\ShouldQueue;
use LaraGram\Queue\InteractsWithQueue;

class SendShipmentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(OrderShipped $event): void
    {
        if (true) {
            $this->release(30);
        }
    }
}
```

<a name="queued-event-listeners-and-database-transactions"></a>
### Queued Event Listeners and Database Transactions

When queued listeners are dispatched within database transactions, they may be processed by the queue before the database transaction has committed. When this happens, any updates you have made to models or database records during the database transaction may not yet be reflected in the database. In addition, any models or database records created within the transaction may not exist in the database. If your listener depends on these models, unexpected errors can occur when the job that dispatches the queued listener is processed.

If your queue connection's `after_commit` configuration option is set to `false`, you may still indicate that a particular queued listener should be dispatched after all open database transactions have been committed by implementing the `ShouldQueueAfterCommit` interface on the listener class:

```php
<?php

namespace App\Listeners;

use LaraGram\Contracts\Queue\ShouldQueueAfterCommit;
use LaraGram\Queue\InteractsWithQueue;

class SendShipmentNotification implements ShouldQueueAfterCommit
{
    use InteractsWithQueue;
}
```

> [!NOTE]
> To learn more about working around these issues, please review the documentation regarding [queued jobs and database transactions](/queues.md#jobs-and-database-transactions).

<a name="handling-failed-jobs"></a>
### Handling Failed Jobs

Sometimes your queued event listeners may fail. If the queued listener exceeds the maximum number of attempts as defined by your queue worker, the `failed` method will be called on your listener. The `failed` method receives the event instance and the `Throwable` that caused the failure:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use LaraGram\Contracts\Queue\ShouldQueue;
use LaraGram\Queue\InteractsWithQueue;
use Throwable;

class SendShipmentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(OrderShipped $event): void
    {
        // ...
    }

    /**
     * Handle a job failure.
     */
    public function failed(OrderShipped $event, Throwable $exception): void
    {
        // ...
    }
}
```

<a name="specifying-queued-listener-maximum-attempts"></a>
#### Specifying Queued Listener Maximum Attempts

If one of your queued listeners is encountering an error, you likely do not want it to keep retrying indefinitely. Therefore, LaraGram provides various ways to specify how many times or for how long a listener may be attempted.

You may define a `$tries` property on your listener class to specify how many times the listener may be attempted before it is considered to have failed:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use LaraGram\Contracts\Queue\ShouldQueue;
use LaraGram\Queue\InteractsWithQueue;

class SendShipmentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The number of times the queued listener may be attempted.
     *
     * @var int
     */
    public $tries = 5;
}
```

As an alternative to defining how many times a listener may be attempted before it fails, you may define a time at which the listener should no longer be attempted. This allows a listener to be attempted any number of times within a given time frame. To define the time at which a listener should no longer be attempted, add a `retryUntil` method to your listener class. This method should return a `DateTime` instance:

```php
use DateTime;

/**
 * Determine the time at which the listener should timeout.
 */
public function retryUntil(): DateTime
{
    return now()->addMinutes(5);
}
```

If both `retryUntil` and `tries` are defined, LaraGram gives precedence to the `retryUntil` method.

<a name="specifying-queued-listener-backoff"></a>
#### Specifying Queued Listener Backoff

If you would like to configure how many seconds LaraGram should wait before retrying a listener that has encountered an exception, you may do so by defining a `backoff` property on your listener class:

```php
/**
 * The number of seconds to wait before retrying the queued listener.
 *
 * @var int
 */
public $backoff = 3;
```

If you require more complex logic for determining the listeners's backoff time, you may define a `backoff` method on your listener class:

```php
/**
 * Calculate the number of seconds to wait before retrying the queued listener.
 */
public function backoff(): int
{
    return 3;
}
```

You may easily configure "exponential" backoffs by returning an array of backoff values from the `backoff` method. In this example, the retry delay will be 1 second for the first retry, 5 seconds for the second retry, 10 seconds for the third retry, and 10 seconds for every subsequent retry if there are more attempts remaining:

```php
/**
 * Calculate the number of seconds to wait before retrying the queued listener.
 *
 * @return list<int>
 */
public function backoff(): array
{
    return [1, 5, 10];
}
```

<a name="dispatching-events"></a>
## Dispatching Events

To dispatch an event, you may call the static `dispatch` method on the event. This method is made available on the event by the `LaraGram\Foundation\Events\Dispatchable` trait. Any arguments passed to the `dispatch` method will be passed to the event's constructor:

```php
<?php

namespace App\Controllers;

use App\Events\OrderShipped;
use App\Models\Order;
use LaraGram\Request\RedirectResponse;
use LaraGram\Request\Request;

class OrderShipmentController extends Controller
{
    /**
     * Ship the given order.
     */
    public function store(Request $request): RedirectResponse
    {
        $order = Order::findOrFail($request->order_id);

        // Order shipment logic...

        OrderShipped::dispatch($order);

        return to_listen('orders');
    }
}
```

If you would like to conditionally dispatch an event, you may use the `dispatchIf` and `dispatchUnless` methods:

```php
OrderShipped::dispatchIf($condition, $order);

OrderShipped::dispatchUnless($condition, $order);
```

<a name="dispatching-events-after-database-transactions"></a>
### Dispatching Events After Database Transactions

Sometimes, you may want to instruct LaraGram to only dispatch an event after the active database transaction has committed. To do so, you may implement the `ShouldDispatchAfterCommit` interface on the event class.

This interface instructs LaraGram to not dispatch the event until the current database transaction is committed. If the transaction fails, the event will be discarded. If no database transaction is in progress when the event is dispatched, the event will be dispatched immediately:

```php
<?php

namespace App\Events;

use App\Models\Order;
use LaraGram\Broadcasting\InteractsWithSockets;
use LaraGram\Contracts\Events\ShouldDispatchAfterCommit;
use LaraGram\Foundation\Events\Dispatchable;
use LaraGram\Queue\SerializesModels;

class OrderShipped implements ShouldDispatchAfterCommit
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Order $order,
    ) {}
}
```

<a name="event-subscribers"></a>
## Event Subscribers

<a name="writing-event-subscribers"></a>
### Writing Event Subscribers

Event subscribers are classes that may subscribe to multiple events from within the subscriber class itself, allowing you to define several event handlers within a single class. Subscribers should define a `subscribe` method, which receives an event dispatcher instance. You may call the `listen` method on the given dispatcher to register event listeners:

```php
<?php

namespace App\Listeners;

use LaraGram\Auth\Events\Login;
use LaraGram\Auth\Events\Logout;
use LaraGram\Events\Dispatcher;

class UserEventSubscriber
{
    /**
     * Handle user login events.
     */
    public function handleUserLogin(Login $event): void {}

    /**
     * Handle user logout events.
     */
    public function handleUserLogout(Logout $event): void {}

    /**
     * Register the listeners for the subscriber.
     */
    public function subscribe(Dispatcher $events): void
    {
        $events->listen(
            Login::class,
            [UserEventSubscriber::class, 'handleUserLogin']
        );

        $events->listen(
            Logout::class,
            [UserEventSubscriber::class, 'handleUserLogout']
        );
    }
}
```

If your event listener methods are defined within the subscriber itself, you may find it more convenient to return an array of events and method names from the subscriber's `subscribe` method. LaraGram will automatically determine the subscriber's class name when registering the event listeners:

```php
<?php

namespace App\Listeners;

use LaraGram\Auth\Events\Login;
use LaraGram\Auth\Events\Logout;
use LaraGram\Events\Dispatcher;

class UserEventSubscriber
{
    /**
     * Handle user login events.
     */
    public function handleUserLogin(Login $event): void {}

    /**
     * Handle user logout events.
     */
    public function handleUserLogout(Logout $event): void {}

    /**
     * Register the listeners for the subscriber.
     *
     * @return array<string, string>
     */
    public function subscribe(Dispatcher $events): array
    {
        return [
            Login::class => 'handleUserLogin',
            Logout::class => 'handleUserLogout',
        ];
    }
}
```

<a name="registering-event-subscribers"></a>
### Registering Event Subscribers

After writing the subscriber, LaraGram will automatically register handler methods within the subscriber if they follow LaraGram's [event discovery conventions](#event-discovery). Otherwise, you may manually register your subscriber using the `subscribe` method of the `Event` facade. Typically, this should be done within the `boot` method of your application's `AppServiceProvider`:

```php
<?php

namespace App\Providers;

use App\Listeners\UserEventSubscriber;
use LaraGram\Support\Facades\Event;
use LaraGram\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::subscribe(UserEventSubscriber::class);
    }
}
```
