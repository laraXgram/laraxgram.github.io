# Authentication

- [Introduction](#introduction)
- [Adding Custom User Providers](#adding-custom-user-providers)
    - [The User Provider Contract](#the-user-provider-contract)
    - [The Authenticatable Contract](#the-authenticatable-contract)


<a name="introduction"></a>
## Introduction

LaraGram's authentication facilities are made up of "providers".

Providers define how users are retrieved from your persistent storage. LaraGram ships with support for retrieving users using [Eloquent](/eloquent.md) and the database query builder. However, you are free to define additional providers as needed for your application.

Your application's authentication configuration file is located at `config/auth.php`. This file contains several well-documented options for tweaking the behavior of LaraGram's authentication services.

<a name="introduction-database-considerations"></a>
### Database Considerations

By default, LaraGram includes an `App\Models\User` [Eloquent model](/eloquent.md) in your `app/Models` directory. This model may be used with the default Eloquent authentication driver.

If your application is not using Eloquent, you may use the `database` authentication provider which uses the LaraGram query builder. If your application is using MongoDB, check out MongoDB's official [LaraGram user authentication documentation](https://www.mongodb.com/docs/drivers/php/laragram-mongodb/current/user-authentication/).

When building the database schema for the `App\Models\User` model, make sure the status column is at least 60 characters in length. Of course, the `users` table migration that is included in new LaraGram applications already creates a column that exceeds this length.


<a name="retrieving-the-authenticated-user"></a>
### Retrieving the Authenticated User

After creating an application from a starter kit and allowing users to register and authenticate with your application, you will often need to interact with the currently authenticated user. While handling an incoming request, you may access the authenticated user via the `Auth` facade's `user` method:

```php
use LaraGram\Support\Facades\Auth;

// Retrieve the currently authenticated user...
$user = Auth::user();

// Retrieve the currently authenticated user's ID...
$id = Auth::id();
```

Alternatively, once a user is authenticated, you may access the authenticated user via an `LaraGram\Request\Request` instance. Remember, type-hinted classes will automatically be injected into your controller methods. By type-hinting the `LaraGram\Request\Request` object, you may gain convenient access to the authenticated user from any controller method in your application via the request's `user` method:

```php
<?php

namespace App\Controllers;

use LaraGram\Request\RedirectResponse;
use LaraGram\Request\Request;

class FlightController extends Controller
{
    /**
     * Update the flight information for an existing flight.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        // ...

        return to_listen('flights');
    }
}
```

<a name="adding-custom-user-providers"></a>
## Adding Custom User Providers

If you are not using a traditional relational database to store your users, you will need to extend LaraGram with your own authentication user provider. We will use the `provider` method on the `Auth` facade to define a custom user provider. The user provider resolver should return an implementation of `LaraGram\Contracts\Auth\UserProvider`:

```php
<?php

namespace App\Providers;

use App\Extensions\MongoUserProvider;
use LaraGram\Contracts\Foundation\Application;
use LaraGram\Support\Facades\Auth;
use LaraGram\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    // ...

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Auth::provider('mongo', function (Application $app, array $config) {
            // Return an instance of LaraGram\Contracts\Auth\UserProvider...

            return new MongoUserProvider($app->make('mongo.connection'));
        });
    }
}
```

After you have registered the provider using the `provider` method, you may switch to the new user provider in your `auth.php` configuration file. First, define a `provider` that uses your new driver:

```php
'providers' => [
    'users' => [
        'driver' => 'mongo',
    ],
],
```

<a name="the-user-provider-contract"></a>
### The User Provider Contract

`LaraGram\Contracts\Auth\UserProvider` implementations are responsible for fetching an `LaraGram\Contracts\Auth\Authenticatable` implementation out of a persistent storage system, such as MySQL, MongoDB, etc. These two interfaces allow the LaraGram authentication mechanisms to continue functioning regardless of how the user data is stored or what type of class is used to represent the authenticated user:

Let's take a look at the `LaraGram\Contracts\Auth\UserProvider` contract:

```php
<?php

namespace LaraGram\Contracts\Auth;

interface UserProvider
{
    public function retrieveByUserId($identifier);
}
```

The `retrieveByUserId` function typically receives a key representing the user, such as a user_id from a MySQL database. The `Authenticatable` implementation matching the user_id should be retrieved and returned by the method.

<a name="the-authenticatable-contract"></a>
### The Authenticatable Contract

Now that we have explored each of the methods on the `UserProvider`, let's take a look at the `Authenticatable` contract. Remember, user providers should return implementations of this interface from the `retrieveById`, `retrieveByToken`, and `retrieveByCredentials` methods:

```php
<?php

namespace LaraGram\Contracts\Auth;

interface Authenticatable
{
    public function getAuthIdentifierName();
    public function getAuthIdentifier();
}
```

This interface is simple. The `getAuthIdentifierName` method should return the name of the "user_id" column for the user and the `getAuthIdentifier` method should return the "user_id" of the user.

This interface allows the authentication system to work with any "user" class, regardless of what ORM or storage abstraction layer you are using. By default, LaraGram includes an `App\Models\User` class in the `app/Models` directory which implements this interface.
