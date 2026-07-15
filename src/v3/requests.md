# HTTP Requests

<a name="introduction"></a>
## Introduction

LaraGram's `LaraGram\Request\Request` class provides an object-oriented way to interact with the current Bot request being handled by your application as well as retrieve the updates that were submitted with the request and work with API methods.

<a name="interacting-with-the-request"></a>
## Interacting With The Request

<a name="accessing-the-request"></a>
### Accessing the Request

To obtain an instance of the current Bot request via dependency injection, you should type-hint the `LaraGram\Request\Request` class on your listen closure or controller method. The incoming request instance will automatically be injected by the LaraGram [service container](/v3/container):

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

Using the `listenIs` method, you may determine if the incoming request has matched a [named listen](/v3/listening#named-listens):

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

<a name="retrieving-all-input-data"></a>
### Retrieving All Input Data

You may retrieve all of the incoming update's data as a nested `array` using the `all` method. The whole update tree is normalized to arrays, so nested fields are available as nested arrays:

```php
$update = $request->all();
```

<a name="retrieving-an-input-value"></a>
#### Retrieving an Input Value

Using the `input` method, you may retrieve any value from the update using "dot" notation, regardless of how deeply nested the field is:

```php
$text = $request->input('message.text');
```

You may pass a default value as the second argument. It will be returned if the requested field is not present on the update:

```php
$text = $request->input('message.text', 'default');
```

<a name="determining-if-input-is-present"></a>
#### Determining if Input Is Present

You may use the `has` method to determine if a value is present on the update. The `has` method returns `true` if the value is present:

```php
if ($request->has('message.text')) {
    // ...
}
```

The `missing` method is the inverse of `has`:

```php
if ($request->missing('message.text')) {
    // ...
}
```

<a name="retrieving-a-portion-of-the-input-data"></a>
#### Retrieving a Portion of the Input Data

If you need to retrieve a subset of the update data, you may use the `only` and `except` methods. Both accept a single `array` or a dynamic list of arguments:

```php
$input = $request->only(['message.text', 'message.chat.id']);

$input = $request->except(['message.entities']);
```

<a name="validating-updates"></a>
### Validating Updates

You may validate the incoming update directly on the request using the `validate` method. Rules target update fields using "dot" notation, and the validated data is returned as a `LaraGram\Request\ValidatedInput` instance:

```php
$validated = $request->validate([
    'message.text' => 'required|string|max:255',
]);

$text = $validated->message->text;
```

For more information, check out the complete [validation documentation](/v3/validation).

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
// ...
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
| `Mode::CURL` (default)   | `32` |
| `Mode::NO_RESPONSE_CURL` | `64` |

### Default API Parameters

LaraGram allows you to specify global default values for optional Telegram Bot API parameters. This eliminates the need to repeatedly pass identical options (such as `parse_mode` or `disable_web_page_preview`) across all your API requests.

These default parameters only apply to optional arguments and are defined under the `default_parameters` array within your `config/laraquest.php` configuration file.

#### Configuring Method Defaults

You can set default parameters for specific methods individually, or define groups to apply defaults to multiple methods simultaneously.

```php
// config/laraquest.php

return [
    // ...

    'default_parameters' => [
        // Set defaults for groups of methods
        'groups' => [
            [
                'methods' => ['sendPhoto', 'sendVideo'],
                'defaults' => [
                    'parse_mode' => 'markdown',
                ]
            ]
        ],
        
        // Set defaults for specific individual methods
        'sendMessage' => [
            'parse_mode' => 'html',
        ]
    ]
];
```

With the configuration above, any call to `sendMessage` will automatically include `'parse_mode' => 'html'` under the hood, and calls to `sendPhoto` or `sendVideo` will fallback to using `'markdown'` formatting unless you explicitly override them at runtime:

```php
// Uses HTML parse_mode automatically based on your config
$request->sendMessage($chatId, 'Hello <b>World</b>');

// Explicitly overrides the default configuration
$request->sendMessage($chatId, 'Hello *World*', parse_mode: 'markdown');
```

<a name="file-downloads"></a>

## File Downloads

### Determining If File Is Present

To check if the incoming request contains any downloadable media or files (such as photos, videos, documents, etc.), you can use the `hasFile` method on the `Request` instance:

```php
Bot::onPhoto(function (Request $request) {
    if ($request->hasFile()) {
        // The request contains one or more files...
    }
});

```

### Retrieving Files

To retrieve the files attached to the current request, you may use the `file` method. This method returns an instance of `LaraGram\Request\Files\FileBag` if files are present, or `null` if the request contains no media:

```php
$fileBag = $request->file();
```

Alternatively, if you want to extract a `FileBag` from a specific Telegram message object manually, you may use the `fileFrom` method:

```php
$fileBag = $request->fileFrom($request->message);
```

### Working With File Bags

The `LaraGram\Request\Files\FileBag` class wraps all files associated with a single request or message, allowing you to seamlessly handle albums, various photo sizes, or video qualities.

#### Inspecting the File Bag

The `FileBag` provides several convenient helper methods to inspect the content:

```php
// Check if the bag is empty or not
if ($fileBag->isNotEmpty()) {
    $count = $fileBag->count();
    $mediaType = $fileBag->type(); // e.g., 'photo', 'video', 'document'
    $mimeType = $fileBag->mimeType(); // Returns the MIME type of the first file
}

// Check if the files are part of a media group (album)
if ($fileBag->isAlbum()) {
    $albumId = $fileBag->mediaGroupId();
}

// Check if the files require Telegram Stars (Paid Media)
if ($fileBag->isPaidMedia()) {
    // ...
}
```

#### Accessing Individual Files

You can easily pull specific files out of the `FileBag`:

```php
// Get the first file (for photos, this is the smallest available size)
$smallestFile = $fileBag->first();

// Get the last file (for photos, this is the largest available size)
$largestFile = $fileBag->last();

// Get all files as an array of MediaFile objects
$allFiles = $fileBag->all();

// Get a file by its specific index
$file = $fileBag->get(0);
```

#### Downloading All Files

The `downloadAll` method downloads all files inside the bag sequentially. You can pass a string directory path (where files will automatically be saved using their `file_unique_id`), or an array of explicit paths mapped to each file index:

```php
// Download all files to a specific directory automatically using unique IDs
$fileBag->downloadAll('downloads/photos');

// Download specifying custom names per file index
$fileBag->downloadAll([
    0 => 'downloads/thumb.jpg',
    1 => 'downloads/full.jpg'
]);

// You can also specify a custom storage disk as the second argument
$fileBag->downloadAll('downloads/photos', 's3');
```

### Working With Media Files

Each item inside a `FileBag` is represented by a `LaraGram\Request\Files\MediaFile` instance. This class gives you access to full file metadata and direct actions.

#### Downloading a Single File

To download an individual `MediaFile`, use the `download` method. LaraGram automatically calls Telegram's `getFile` API behind the scenes to resolve the absolute path, downloads the raw stream, and stores it using the integrated `Storage` system:

```php
// Download to default storage disk
$file->download('avatars/user_profile.jpg');

// Download to a specific configured storage disk (e.g., public, s3)
$file->download('avatars/user_profile.jpg', 'public');
```

If you only need the absolute Telegram download URL (or local server path), you may call the url method:

```php
$url = $file->url();
```

#### Retrieving File Metadata

```php
$fileId = $file->fileId();
$uniqueId = $file->fileUniqueId();
$sizeInBytes = $file->fileSize();
$fileName = $file->fileName(); // Only available for documents

// Dimensions and durations
$width = $file->width();
$height = $file->height();
$duration = $file->duration(); // For video/audio
```

#### Verifying Media Types

You can evaluate the specific nature of a `MediaFile` using fluent boolean checkers:

```php
if ($file->isPhoto()) { /* ... */ }
if ($file->isVideo()) { /* ... */ }
if ($file->isDocument()) { /* ... */ }
if ($file->isSticker()) { /* ... */ }
if ($file->isAudio()) { /* ... */ }
if ($file->isVoice()) { /* ... */ }
if ($file->isVideoNote()) { /* ... */ }
if ($file->isAnimation()) { /* ... */ }
if ($file->isLivePhoto()) { /* ... */ }
```

#### Handling Sizes and Qualities

If a file has multiple sizes (like Telegram Photos) or different quality options (like Videos in newer Bot API versions), you can navigate through those variants directly from the file instance:

```php
if ($file->hasSizes()) {
    $allVariants = $file->sizes();
    $lowestQuality = $file->smallest();
    $highestQuality = $file->largest();
    
    // Get variant at specific index
    $mediumQuality = $file->size(1);
}
```

<a name="multi-connections"></a>
## Multi connections

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

<a name="receiving-updates-from-multiple-bots"></a>
### Receiving Updates From Multiple Bots

Sometimes you want a single application to receive updates from several different bots at once. To do this, give each connection its own `secret_token` in the `config/bot.php` file and set the `default` connection to `auto`:

```php
'default' => 'auto',

'connections' => [
    'first' => [
        'token' => '',
        'secret_token' => "AAA",
    ],
    'second' => [
        'token' => '',
        'secret_token' => "BBB",
    ],
],
```

When the `default` connection is set to `auto`, LaraGram inspects the secret token sent with each incoming update and automatically determines which connection it belongs to. The matching connection is then set as the current, active connection for that request, so any request you send back—as well as features like the `connection` method—will use the correct bot without any manual configuration.

> [!NOTE]
> The `secret_token` of each connection must be unique. It is the value LaraGram uses to identify which bot an incoming update came from. The same token must also be configured as the webhook secret token of the corresponding bot.
