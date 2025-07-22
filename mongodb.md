# MongoDB

<a name="introduction"></a>
## Introduction

[MongoDB](https://www.mongodb.com/resources/products/fundamentals/why-use-mongodb) is one of the most popular NoSQL document-oriented database, used for its high write load (useful for analytics or IoT) and high availability (easy to set replica sets with automatic failover). It can also shard the database easily for horizontal scalability and has a powerful query language for doing aggregation, text search or geospatial queries.

Instead of storing data in tables of rows or columns like SQL databases, each record in a MongoDB database is a document described in BSON, a binary representation of the data. Applications can then retrieve this information in a JSON format. It supports a wide variety of data types, including documents, arrays, embedded documents, and binary data.

Before using MongoDB with LaraGram, we recommend installing and using the `laraxgram/laragram-mongodb` package via Composer. The `laragram-mongodb` package is officially maintained by MongoDB, and while MongoDB is natively supported by PHP through the MongoDB driver, the [LaraGram MongoDB](https://www.mongodb.com/docs/drivers/php/laravel-mongodb/) package provides a richer integration with Eloquent and other LaraGram features:

```shell
composer require laraxgram/laragram-mongodb
```

<a name="installation"></a>
## Installation

<a name="mongodb-driver"></a>
### MongoDB Driver

To connect to a MongoDB database, the `mongodb` PHP extension is required. If you are developing locally using [LaraGram Herd](https://herd.laragram.com) or installed PHP via `php.new`, you already have this extension installed on your system. However, if you need to install the extension manually, you may do so via PECL:

```shell
pecl install mongodb
```

For more information on installing the MongoDB PHP extension, check out the [MongoDB PHP extension installation instructions](https://www.php.net/manual/en/mongodb.installation.php).

<a name="starting-a-mongodb-server"></a>
### Starting a MongoDB Server

The MongoDB Community Server can be used to run MongoDB locally and is available for installation on Windows, macOS, Linux, or as a Docker container. To learn how to install MongoDB, please refer to the [official MongoDB Community installation guide](https://docs.mongodb.com/manual/administration/install-community/).

The connection string for the MongoDB server can be set in your `.env` file:

```ini
MONGODB_URI="mongodb://localhost:27017"
MONGODB_DATABASE="laragram_app"
```

For hosting MongoDB in the cloud, consider using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
To access a MongoDB Atlas cluster locally from your application, you will need to [add your own IP address in the cluster's network settings](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/) to the project's IP Access List.

The connection string for MongoDB Atlas can also be set in your `.env` file:

```ini
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"
MONGODB_DATABASE="laragram_app"
```

<a name="install-the-laragram-mongodb-package"></a>
### Install the LaraGram MongoDB Package

Finally, use Composer to install the LaraGram MongoDB package:

```shell
composer require laraxgram/laragram-mongodb
```

> [!NOTE]
> This installation of the package will fail if the `mongodb` PHP extension is not installed. The PHP configuration can differ between the CLI and the web server, so ensure the extension is enabled in both configurations.

<a name="configuration"></a>
## Configuration

You may configure your MongoDB connection via your application's `config/database.php` configuration file. Within this file, add a `mongodb` connection that utilizes the `mongodb` driver:

```php
'connections' => [
    'mongodb' => [
        'driver' => 'mongodb',
        'dsn' => env('MONGODB_URI', 'mongodb://localhost:27017'),
        'database' => env('MONGODB_DATABASE', 'laragram_app'),
    ],
],
```

<a name="features"></a>
## Features

Once your configuration is complete, you can use the `mongodb` package and database connection in your application to leverage a variety of powerful features:

- [Using Eloquent](https://www.mongodb.com/docs/drivers/php/laragram-mongodb/current/eloquent-models/), models can be stored in MongoDB collections. In addition to the standard Eloquent features, the LaraGram MongoDB package provides additional features such as embedded relationships. The package also provides direct access to the MongoDB driver, which can be used to execute operations such as raw queries and aggregation pipelines.
- [Write complex queries](https://www.mongodb.com/docs/drivers/php/laragram-mongodb/current/query-builder/) using the query builder.
- The `mongodb` [cache driver](https://www.mongodb.com/docs/drivers/php/laragram-mongodb/current/cache/) is optimized to use MongoDB features such as TTL indexes to automatically clear expired cache entries.
- [Dispatch and process queued jobs](https://www.mongodb.com/docs/drivers/php/laragram-mongodb/current/queues/) with the `mongodb` queue driver.
- [Storing files in GridFS](https://www.mongodb.com/docs/drivers/php/laragram-mongodb/current/filesystems/), via the [GridFS Adapter for Flysystem](https://flysystem.thephpleague.com/docs/adapter/gridfs/).
- Most third party packages using a database connection or Eloquent can be used with MongoDB.

To continue learning how to use MongoDB and LaraGram, refer to MongoDB's [Quick Start guide](https://www.mongodb.com/docs/drivers/php/laragram-mongodb/current/quick-start/).
