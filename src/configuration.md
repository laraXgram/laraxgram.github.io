# Configuration

<a name="introduction"></a>
## Introduction

All of the configuration files for the LaraGram framework are stored in the `config` directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.

These configuration files allow you to configure things like your database connection information, as well as various other core configuration values such as your application URL and encryption key.

<a name="the-about-command"></a>
#### The `about` Command

LaraGram can display an overview of your application's configuration, drivers, and environment via the `about` Commander command.

```shell
php laragram about
```

If you're only interested in a particular section of the application overview output, you may filter for that section using the `--only` option:

```shell
php laragram about --only=environment
```

Or, to explore a specific configuration file's values in detail, you may use the `config:show` Commander command:

```shell
php laragram config:show database
```

<a name="environment-configuration"></a>
## Environment Configuration

It is often helpful to have different configuration values based on the environment where the application is running. For example, you may wish to use a different cache driver locally than you do on your production server.

To make this a cinch, LaraGram uses a rewritten version of the [DotEnv](https://github.com/vlucas/phpdotenv) PHP library. In a fresh LaraGram installation, the root directory of your application will contain a `.env.example` file that defines many common environment variables. During the LaraGram installation process, this file will automatically be copied to `.env`.

LaraGram's default `.env` file contains some common configuration values that may differ based on whether your application is running locally or on a production web server. These values are then read by the configuration files within the `config` directory using LaraGram's `env` function.

If you are developing with a team, you may wish to continue including and updating the `.env.example` file with your application. By putting placeholder values in the example configuration file, other developers on your team can clearly see which environment variables are needed to run your application.

> [!NOTE]
> Any variable in your `.env` file can be overridden by external environment variables such as server-level or system-level environment variables.

<a name="environment-file-security"></a>
#### Environment File Security

Your `.env` file should not be committed to your application's source control, since each developer / server using your application could require a different environment configuration. Furthermore, this would be a security risk in the event an intruder gains access to your source control repository, since any sensitive credentials would get exposed.

However, it is possible to encrypt your environment file using LaraGram's built-in [environment encryption](#encrypting-environment-files). Encrypted environment files may be placed in source control safely.

<a name="additional-environment-files"></a>
#### Additional Environment Files

Before loading your application's environment variables, LaraGram determines if an `APP_ENV` environment variable has been externally provided or if the `--env` CLI argument has been specified. If so, LaraGram will attempt to load an `.env.[APP_ENV]` file if it exists. If it does not exist, the default `.env` file will be loaded.

<a name="environment-variable-types"></a>
### Environment Variable Types

All variables in your `.env` files are typically parsed as strings, so some reserved values have been created to allow you to return a wider range of types from the `env()` function:

<div class="overflow-auto">

| `.env` Value | `env()` Value |
| ------------ | ------------- |
| true         | (bool) true   |
| (true)       | (bool) true   |
| false        | (bool) false  |
| (false)      | (bool) false  |
| empty        | (string) ''   |
| (empty)      | (string) ''   |
| null         | (null) null   |
| (null)       | (null) null   |

</div>

If you need to define an environment variable with a value that contains spaces, you may do so by enclosing the value in double quotes:

```ini
APP_NAME="My Application"
```

<a name="retrieving-environment-configuration"></a>
### Retrieving Environment Configuration

All of the variables listed in the `.env` file will be loaded into the `$_ENV` PHP super-global when your application receives a request. However, you may use the `env` function to retrieve values from these variables in your configuration files. In fact, if you review the LaraGram configuration files, you will notice many of the options are already using this function:

```php
'debug' => env('APP_DEBUG', false),
```

The second value passed to the `env` function is the "default value". This value will be returned if no environment variable exists for the given key.

<a name="determining-the-current-environment"></a>
### Determining the Current Environment

The current application environment is determined via the `APP_ENV` variable from your `.env` file. You may access this value via the `environment` method on the `App` [facade](/facades.md):

```php
use LaraGram\Support\Facades\App;

$environment = App::environment();
```

You may also pass arguments to the `environment` method to determine if the environment matches a given value. The method will return `true` if the environment matches any of the given values:

```php
if (App::environment('local')) {
    // The environment is local
}

if (App::environment(['local', 'staging'])) {
    // The environment is either local OR staging...
}
```

> [!NOTE]
> The current application environment detection can be overridden by defining a server-level `APP_ENV` environment variable.

<a name="encrypting-environment-files"></a>
### Encrypting Environment Files

Unencrypted environment files should never be stored in source control. However, LaraGram allows you to encrypt your environment files so that they may safely be added to source control with the rest of your application.

<a name="encryption"></a>
#### Encryption

To encrypt an environment file, you may use the `env:encrypt` command:

```shell
php laragram env:encrypt
```

Running the `env:encrypt` command will encrypt your `.env` file and place the encrypted contents in an `.env.encrypted` file. The decryption key is presented in the output of the command and should be stored in a secure password manager. If you would like to provide your own encryption key you may use the `--key` option when invoking the command:

```shell
php laragram env:encrypt --key=3UVsEgGVK36XN82KKeyLFMhvosbZN1aF
```

> [!NOTE]
> The length of the key provided should match the key length required by the encryption cipher being used. By default, LaraGram will use the `AES-256-CBC` cipher which requires a 32 character key. You are free to use any cipher supported by LaraGram's [encrypter](/encryption.md) by passing the `--cipher` option when invoking the command.

If your application has multiple environment files, such as `.env` and `.env.staging`, you may specify the environment file that should be encrypted by providing the environment name via the `--env` option:

```shell
php laragram env:encrypt --env=staging
```

<a name="decryption"></a>
#### Decryption

To decrypt an environment file, you may use the `env:decrypt` command. This command requires a decryption key, which LaraGram will retrieve from the `LARAGRAM_ENV_ENCRYPTION_KEY` environment variable:

```shell
php laragram env:decrypt
```

Or, the key may be provided directly to the command via the `--key` option:

```shell
php laragram env:decrypt --key=3UVsEgGVK36XN82KKeyLFMhvosbZN1aF
```

When the `env:decrypt` command is invoked, LaraGram will decrypt the contents of the `.env.encrypted` file and place the decrypted contents in the `.env` file.

The `--cipher` option may be provided to the `env:decrypt` command in order to use a custom encryption cipher:

```shell
php laragram env:decrypt --key=qUWuNRdfuImXcKxZ --cipher=AES-128-CBC
```

If your application has multiple environment files, such as `.env` and `.env.staging`, you may specify the environment file that should be decrypted by providing the environment name via the `--env` option:

```shell
php laragram env:decrypt --env=staging
```

In order to overwrite an existing environment file, you may provide the `--force` option to the `env:decrypt` command:

```shell
php laragram env:decrypt --force
```

<a name="accessing-configuration-values"></a>
## Accessing Configuration Values

You may easily access your configuration values using the `Config` facade or global `config` function from anywhere in your application. The configuration values may be accessed using "dot" syntax, which includes the name of the file and option you wish to access. A default value may also be specified and will be returned if the configuration option does not exist:

```php
use LaraGram\Support\Facades\Config;

$value = Config::get('app.timezone');

$value = config('app.timezone');

// Retrieve a default value if the configuration value does not exist...
$value = config('app.timezone', 'Asia/Seoul');
```

To set configuration values at runtime, you may invoke the `Config` facade's `set` method or pass an array to the `config` function:

```php
Config::set('app.timezone', 'America/Chicago');

config(['app.timezone' => 'America/Chicago']);
```

To assist with static analysis, the `Config` facade also provides typed configuration retrieval methods. If the retrieved configuration value does not match the expected type, an exception will be thrown:

```php
Config::string('config-key');
Config::integer('config-key');
Config::float('config-key');
Config::boolean('config-key');
Config::array('config-key');
Config::collection('config-key');
```

<a name="configuration-caching"></a>
## Configuration Caching

To give your application a speed boost, you should cache all of your configuration files into a single file using the `config:cache` Commander command. This will combine all of the configuration options for your application into a single file which can be quickly loaded by the framework.

You should typically run the `php laragram config:cache` command as part of your production deployment process. The command should not be run during local development as configuration options will frequently need to be changed during the course of your application's development.

Once the configuration has been cached, your application's `.env` file will not be loaded by the framework during requests or Commander commands; therefore, the `env` function will only return external, system level environment variables.

For this reason, you should ensure you are only calling the `env` function from within your application's configuration (`config`) files. You can see many examples of this by examining LaraGram's default configuration files. Configuration values may be accessed from anywhere in your application using the `config` function [described above](#accessing-configuration-values).

The `config:clear` command may be used to purge the cached configuration:

```shell
php laragram config:clear
```

> [!WARNING]
> If you execute the `config:cache` command during your deployment process, you should be sure that you are only calling the `env` function from within your configuration files. Once the configuration has been cached, the `.env` file will not be loaded; therefore, the `env` function will only return external, system level environment variables.

<a name="configuration-publishing"></a>
## Configuration Publishing

Most of LaraGram's configuration files are already published in your application's `config` directory; however, certain configuration files like `templates.php` are not published by default, as most applications will never need to modify them.

However, you may use the `config:publish` Commander command to publish any configuration files that are not published by default:

```shell
php laragram config:publish

php laragram config:publish --all
```

<a name="debug-mode"></a>
## Debug Mode

The `debug` option in your `config/app.php` configuration file determines how much information about an error is actually displayed to the user. By default, this option is set to respect the value of the `APP_DEBUG` environment variable, which is stored in your `.env` file.

> [!WARNING]
> For local development, you should set the `APP_DEBUG` environment variable to `true`. **In your production environment, this value should always be `false`. If the variable is set to `true` in production, you risk exposing sensitive configuration values to your application's end users.**
