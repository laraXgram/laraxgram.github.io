# HTTP Requests

<a name="introduction"></a>
## Introduction

LaraGram's `LaraGram\Request\Request` class provides an object-oriented way to interact with the current Bot request being handled by your application as well as retrieve the updates that were submitted with the request and work with API methods.

<a name="interacting-with-the-request"></a>
## Interacting With The Request

<a name="accessing-the-request"></a>
### Accessing the Request

To obtain an instance of the current Bot request via dependency injection, you should type-hint the `LaraGram\Request\Request` class on your listen closure or controller method. The incoming request instance will automatically be injected by the LaraGram [service container](/src/container.mdr.md):

```php
<?php

namespace App\Request\Controllers;

use LaraGram\Request\Request;

class UserController extends Controller
{
    /**
     * Store a new user.
     */
    public function store(Request $request)
    {
        $name = $request->message->user->first_name;

        // Store the user...

        $request->sendMessage($request->message->chat->id, 'User stored!')
    }
}
```

As mentioned, you may also type-hint the `LaraGram\Request\Request` class on a listen closure. The service container will automatically inject the incoming request into the closure when it is executed:

```php
use LaraGram\Request\Request;

Bot::onText('hello', function (Request $request) {
    // ...
});
```

<a name="dependency-injection-listen-parameters"></a>
#### Dependency Injection and Listen Parameters

If your controller method is also expecting input from a listen parameter you should list your listen parameters after your other dependencies. For example, if your listen is defined like so:

```php
use App\Request\Controllers\UserController;

Bot::onText('user {id}', [UserController::class, 'update']);
```

You may still type-hint the `LaraGram\Request\Request` and access your `id` listen parameter by defining your controller method as follows:

```php
<?php

namespace App\Request\Controllers;

use LaraGram\Request\RedirectResponse;
use LaraGram\Request\Request;

class UserController extends Controller
{
    /**
     * Update the specified user.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        // Update the user...

        return to_listen('users');
    }
}
```

<a name="request-scope-and-method"></a>
### Request Scope, and Method

<a name="retrieving-the-request-scope"></a>
#### Retrieving the Request Scope

The `scope` method returns the request's Scope such as `group`, `supergroup`, `private`, `channel`. So, if the incoming request is from a private chat, the `scope` method will return `private`:

```php
$scope = $request->scope();
```

<a name="inspecting-the-request-listen"></a>
#### Inspecting the Request Listen

Using the `listenIs` method, you may determine if the incoming request has matched a [named listen](/src/listening.mdg.md#named-listens):

```php
if ($request->listenIs('admin.*')) {
    // ...
}
```

<a name="retrieving-the-request-method"></a>
#### Retrieving the Request Method

The `method` method will return the Bot verb for the request. You may use the `isMethod` method to verify that the Bot verb matches a given string:

```php
$method = $request->method();

if ($request->isMethod('text')) {
    // ...
}
```

<a name="retrieving-the-request-secret-toek"></a>
#### Retrieving the Request Secret Token

For convenience, the `secretToken` method may be used to retrieve a secret_token from the webhook. If no such secret_token is present, an empty string will be returned:

```php
$token = $request->secretToken();
```

<a name="updates"></a>
## Updates

<a name="retrieving-updates-via-dynamic-properties"></a>
#### Retrieving Updates via Dynamic Properties

Access updates using dynamic properties on the `LaraGram\Request\Request` instance. For example, if you need the incoming text, you may access the value of the field like so:

```php
$text = $request->message->text;
```
You can receive all updates according to the official Telegram documentation, with full support for syntax highlighting in your editor or IDE.

<a name="merging-additional-input"></a>
### Merging Additional Input

Sometimes you may need to manually merge additional input into the request's existing input data. To accomplish this, you may use the `merge` method. If a given input key already exists on the request, it will be overwritten by the data provided to the `merge` method:

```php
$request->merge(['votes' => 0]);
```

The `mergeIfMissing` method may be used to merge input into the request if the corresponding keys do not already exist within the request's input data:

```php
$request->mergeIfMissing(['votes' => 0]);
```

<a name="methods"></a>
## Methods

<a name="work-with-api-methods"></a>
### Work with API methods

Through the Request class, you have access to all Telegram methods according to the latest version of the Bot API.

```php
$request->sendMessage();
$request->sendAnimation();
$request->deleteMessage();
```

<a name="request-mode"></a>
### Request mode

You can also configure how requests are sent. This can easily be done using the `mode` method.

In some cases, you might not need a response from Telegram — so you can use the no-response mode to improve performance and achieve faster execution.

```php
use LaraGram\Laraquest\Mode;

$request->mode(Mode::NO_RESPONSE_CURL)->sendMessage();
```

Or, you can use its integer equivalent instead:

```php
$request->mode(64)->sendMessage();
```

<a name="available-request-modes"></a>
### Available Request Modes

| Enum Value               | Int  |
|--------------------------|------|
| `Mode::CURL`             | `32` |
| `Mode::NO_RESPONSE_CURL` | `64` |

<a name="multi-connections"></a>
### Multi connections

You can easily create multiple bot connections and use different connections for different types of requests.

To do this, simply define a new connection with a custom name in the `connections` section of the `config/bot.php` file.

After that, you can specify which connection to use for sending a request using the connection method.

```php
$request->connection('connection_name')->sendMessage();
```

You can also apply a specific connection to a group of listeners.

```php
Bot::connection('connection_name')->group(function (){
    // ...
});
```
