# Redirects

<a name="creating-redirects"></a>
## Creating Redirects

Redirect responses are instances of the `LaraGram\Request\RedirectResponse` class, and redirect the user to another listen. There are several ways to generate a `RedirectResponse` instance. The simplest method is to use the global `redirect` helper:

```php
Bot:onCommand('dashboard', function () {
    return redirect()->listen('home');
});
```

<a name="redirecting-named-listens"></a>
## Redirecting To Named Listens

When you call the `redirect` helper with no parameters, an instance of `LaraGram\Listening\Redirector` is returned, allowing you to call any method on the `Redirector` instance. For example, to generate a `RedirectResponse` to a named listen, you may use the `listen` method:

```php
return redirect()->listen('login');
```

If your listen has parameters, you may pass them as the second argument to the `listen` method:

```php
// For a listen with the following Pattern: profile {id}

return redirect()->listen('profile', ['id' => 1]);
```

For convenience, LaraGram also offers the global `to_listen` function:

```php
return to_listen('profile', ['id' => 1]);
```

<a name="populating-parameters-via-eloquent-models"></a>
#### Populating Parameters Via Eloquent Models

If you are redirecting to a listen with an "ID" parameter that is being populated from an Eloquent model, you may pass the model itself. The ID will be extracted automatically:

```php
// For a listen with the following Pattern: profile {id}

return redirect()->listen('profile', [$user]);
```

If you would like to customize the value that is placed in the listen parameter, you should override the `getListenKey` method on your Eloquent model:

```php
/**
 * Get the value of the model's listen key.
 */
public function getListenKey(): mixed
{
    return $this->slug;
}
```

<a name="redirecting-controller-actions"></a>
## Redirecting To Controller Actions

You may also generate redirects to [controller actions](/controllers.md). To do so, pass the controller and action name to the `action` method:

```php
use App\Controllers\HomeController;

return redirect()->action([HomeController::class, 'index']);
```

If your controller listen requires parameters, you may pass them as the second argument to the `action` method:

```php
return redirect()->action(
    [UserController::class, 'profile'], ['id' => 1]
);
```

<a name="redirecting-with-puted-cache-data"></a>
## Redirecting With Flashed Session Data

Redirecting to a new listen and [putting data to the cache](/cache.md#storing-items-in-the-cache) are usually done at the same time. Typically, this is done after successfully performing an action when you put a success message to the cache. For convenience, you may create a `RedirectResponse` instance and put data to the cache in a single, fluent method chain:

```php
Bot:onCommand('dashboard', function () {
    // Update the user's profile...

    return to_listen('home')->with('status', 'Profile updated!');
});
```

You may use the `withInput` method provided by the `RedirectResponse` instance to put the current request's input data to the cache before redirecting the user to a new location. Once the input has been putted to the cache, you may easily [retrieve it](/cache.md#retrieving-items-from-the-cache) during the next request:

```php
return to_listen('home')->withInput();
```

After the user is redirected, you may display the putted message from the [cache](/cache.md#storing-items-in-the-cache). For example, using [Template syntax](/temple8.md):

```blade
@if (cache('status'))
    {{ cache('status') }}
@endif
```
