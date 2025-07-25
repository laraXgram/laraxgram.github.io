# Encryption

<a name="introduction"></a>
## Introduction

LaraGram's encryption services provide a simple, convenient interface for encrypting and decrypting text via OpenSSL using AES-256 and AES-128 encryption. All of LaraGram's encrypted values are signed using a message authentication code (MAC) so that their underlying value cannot be modified or tampered with once encrypted.

<a name="configuration"></a>
## Configuration

Before using LaraGram's encrypter, you must set the `key` configuration option in your `config/app.php` configuration file. This configuration value is driven by the `APP_KEY` environment variable. You should use the `php laragram key:generate` command to generate this variable's value since the `key:generate` command will use PHP's secure random bytes generator to build a cryptographically secure key for your application. Typically, the value of the `APP_KEY` environment variable will be generated for you during [LaraGram's installation](/installation.md).

<a name="gracefully-rotating-encryption-keys"></a>
### Gracefully Rotating Encryption Keys

If you change your application's encryption key, all authenticated user sessions will be logged out of your application. This is because every cookie, including session cookies, are encrypted by LaraGram. In addition, it will no longer be possible to decrypt any data that was encrypted with your previous encryption key.

To mitigate this issue, LaraGram allows you to list your previous encryption keys in your application's `APP_PREVIOUS_KEYS` environment variable. This variable may contain a comma-delimited list of all of your previous encryption keys:

```ini
APP_KEY="base64:J63qRTDLub5NuZvP+kb8YIorGS6qFYHKVo6u7179stY="
APP_PREVIOUS_KEYS="base64:2nLsGFGzyoae2ax3EF2Lyq/hH6QghBGLIq5uL+Gp8/w="
```

When you set this environment variable, LaraGram will always use the "current" encryption key when encrypting values. However, when decrypting values, LaraGram will first try the current key, and if decryption fails using the current key, LaraGram will try all previous keys until one of the keys is able to decrypt the value.

This approach to graceful decryption allows users to keep using your application uninterrupted even if your encryption key is rotated.

<a name="using-the-encrypter"></a>
## Using the Encrypter

<a name="encrypting-a-value"></a>
#### Encrypting a Value

You may encrypt a value using the `encryptString` method provided by the `Crypt` facade. All encrypted values are encrypted using OpenSSL and the AES-256-CBC cipher. Furthermore, all encrypted values are signed with a message authentication code (MAC). The integrated message authentication code will prevent the decryption of any values that have been tampered with by malicious users:

```php
<?php

namespace App\Controllers;

use LaraGram\Request\RedirectResponse;
use LaraGram\Request\Request;
use LaraGram\Support\Facades\Crypt;

class DigitalOceanTokenController extends Controller
{
    /**
     * Store a DigitalOcean API token for the user.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->user()->fill([
            'token' => Crypt::encryptString($request->token),
        ])->save();

        return to_listen('secrets');
    }
}
```

<a name="decrypting-a-value"></a>
#### Decrypting a Value

You may decrypt values using the `decryptString` method provided by the `Crypt` facade. If the value cannot be properly decrypted, such as when the message authentication code is invalid, an `LaraGram\Contracts\Encryption\DecryptException` will be thrown:

```php
use LaraGram\Contracts\Encryption\DecryptException;
use LaraGram\Support\Facades\Crypt;

try {
    $decrypted = Crypt::decryptString($encryptedValue);
} catch (DecryptException $e) {
    // ...
}
```
