# Installation

<a name="meet-laragram"></a>
## Meet LaraGram

LaraGram is a professional framework for building advanced Telegram bots, inspired by the powerful Laravel framework.
With its clean syntax and structured design, LaraGram helps you create smart and scalable bots — without getting lost in the technical clutter.

If you're familiar with LaraGram, you'll feel right at home with Laravel — and vice versa. The two are so closely aligned that learning one makes working with the other a breeze. Now’s the time to focus on building something incredible. Let us handle the details.

LaraGram strives to provide an amazing developer experience while providing powerful features such as thorough dependency injection, an expressive database abstraction layer, queues and scheduled jobs, unit and integration testing, and more.

Whether you are new to PHP web frameworks or have years of experience, LaraGram is a framework that can grow with you. We'll help you take your first steps as a bot developer or give you a boost as you take your expertise to the next level. We can't wait to see what you build.

<a name="why-laragram"></a>
### Why LaraGram?

There are a variety of tools and frameworks available to you when building a bot application. However, we believe LaraGram is the best choice for building modern bot applications.

#### A Progressive Framework

We like to call LaraGram a "progressive" framework. By that, we mean that LaraGram grows with you. If you're just taking your first steps into bot development, LaraGram's vast library of documentation and guides will help you learn the ropes without becoming overwhelmed.

If you're a senior developer, LaraGram gives you robust tools for [dependency injection](/container.md), [queues](/queues.md), and more. LaraGram is fine-tuned for building professional bot applications and ready to handle enterprise work loads.

#### A Scalable Framework

LaraGram is incredibly scalable. Thanks to the scaling-friendly nature of PHP and LaraGram's built-in support for fast, distributed cache systems like Redis. In fact, LaraGram applications have been easily scaled to handle hundreds of millions of requests per month.

<a name="creating-a-laragram-project"></a>
## Creating a LaraGram Application

<a name="installing-php"></a>
### Installing PHP and the LaraGram Installer

Before creating your first LaraGram application, make sure that your local machine has [PHP](https://php.net), [Composer](https://getcomposer.org), and [the LaraGram installer](https://github.com/laragram/installer) installed.

If you don't have PHP and Composer installed on your local machine, the following commands will install PHP, Composer, and the LaraGram installer on macOS, Windows, or Linux:

```shell tab=macOS
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.4)"
```

```shell tab=Windows PowerShell
# Run as administrator...
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
```

```shell tab=Linux
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"
```

After running one of the commands above, you should restart your terminal session. To update PHP, Composer, and the LaraGram installer after installing them via `php.new`, you can re-run the command in your terminal.

If you already have PHP and Composer installed, you may install the LaraGram installer via Composer:

```shell
composer global require laraxgram/installer
```

<a name="creating-an-application"></a>
### Creating an Application

After you have installed PHP, Composer, and the LaraGram installer, you're ready to create a new LaraGram application. The LaraGram installer will prompt you to select your preferred database, and config your bot:

```shell
laragram new example-app
```

Once the application has been created, you can start LaraGram's local development server using the `serve` laragram script:

```shell
cd example-app
php laragram serve
```

Once you have started the development server, your application will be accessible at `http://localhost:9000` for set webhook. Next, you're ready to [start taking your next steps into the LaraGram ecosystem](#next-steps). Of course, you may also want to [configure a database](#databases-and-migrations).

<a name="initial-configuration"></a>
## Initial Configuration

All of the configuration files for the LaraGram framework are stored in the `config` directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.

LaraGram needs almost no additional configuration out of the box. You are free to get started developing! However, you may wish to review the `config/app.php` file and its documentation. It contains several options such as `url` and `locale` that you may wish to change according to your application.

<a name="environment-based-configuration"></a>
### Environment Based Configuration

Since many of LaraGram's configuration option values may vary depending on whether your application is running on your local machine or on a production web server, many important configuration values are defined using the `.env` file that exists at the root of your application.

Your `.env` file should not be committed to your application's source control, since each developer / server using your application could require a different environment configuration. Furthermore, this would be a security risk in the event an intruder gains access to your source control repository, since any sensitive credentials would be exposed.

> [!NOTE]
> For more information about the `.env` file and environment based configuration, check out the full [configuration documentation](/configuration#environment-configuration).

<a name="config-bot-connections"></a>
### Config Bot Connection

You can easily create multiple connections for your bot. To do this, define your bot in the `config/bot.php` file under the connections section.
Simply set your token and url, then run the following command:
```shell
php laragram webhook:set
```

Additionally, you can customize the `endpoint` in the `api_server` section based on your needs.
Or, by setting `api_id` and `api_hash`, you can start your own API server by running:
```shell
php laragram start:apiserver
```

<a name="databases-and-migrations"></a>
### Databases and Migrations

Now that you have created your LaraGram application, you probably want to store some data in a database. By default, your application's `.env` configuration file specifies that LaraGram will be interacting with an SQLite database.

During the creation of the application, LaraGram created a `database/database.sqlite` file for you, and ran the necessary migrations to create the application's database tables.

If you prefer to use another database driver such as MySQL or PostgreSQL, you can update your `.env` configuration file to use the appropriate database. For example, if you wish to use MySQL, update your `.env` configuration file's `DB_*` variables like so:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laragram
DB_USERNAME=root
DB_PASSWORD=
```

If you choose to use a database other than SQLite, you will need to create the database and run your application's [database migrations](/migrations.md):

```shell
php laragram migrate
```

<a name="directory-configuration"></a>
### Directory Configuration

LaraGram should always be served out of the root of the "web directory" configured for your web server. You should not attempt to serve a LaraGram application out of a subdirectory of the "web directory". Attempting to do so could expose sensitive files present within your application.

<a name="next-steps"></a>
## Next Steps

Now that you have created your LaraGram application, you may be wondering what to learn next. First, we strongly recommend becoming familiar with how LaraGram works by reading the following documentation:

<div class="content-list" markdown="1">

- [Request Lifecycle](/lifecycle.md)
- [Configuration](/configuration.md)
- [Directory Structure](/structure.md)
- [Service Container](/container.md)
- [Facades](/facades.md)

</div>

How you want to use LaraGram will also dictate the next steps on your journey. There are a variety of ways to use LaraGram, and we'll explore two primary use cases for the framework below.
