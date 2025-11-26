# Keyboard Builder

<a name="introduction"></a>
## Introduction

LaraGram is equipped with an advanced and flexible keyboard builder, allowing you to easily create various types of Telegram keyboards with a clean and professional structure.

<a name="keyboard-types"></a>
## Keyboard Types

LaraGram supports several types of keyboards that you can create using the keyboard builder:

#### Reply Keyboards

Reply keyboards are displayed below the message input field on the user's device. They can contain multiple rows of buttons and are persistent until removed.
```php
use LaraGram\Support\Facades\Keyboard;

$keyboard = Keyboard::replyKeyboardMarkup();
```

#### Inline Keyboards

Inline keyboards are attached directly to messages and allow users to interact with the bot by pressing buttons within the message itself. These keyboards are ideal for interactive content.
```php
use LaraGram\Support\Facades\Keyboard;

$keyboard = Keyboard::inlineKeyboardMarkup();
```

#### Force Reply

The force reply keyboard prompts the user to reply to a specific message, useful for collecting user input in a conversational manner.
```php
use LaraGram\Support\Facades\Keyboard;

$keyboard = Keyboard::forceReply();
```

#### Remove Keyboard

This option allows you to hide the current keyboard, returning the user to the standard input field.
```php
use LaraGram\Support\Facades\Keyboard;

$keyboard = Keyboard::replyKeyboardRemove();
```

<a name="available-methods"></a>
## Available Methods

The keyboard builder provides a fluent interface for constructing keyboards. Below are the key methods available:

### Creating a Keyboard

To start building a keyboard, use the `make` method:

```php
use LaraGram\Keyboard\Keyboard;

$keyboard = Keyboard::make();
```

### Adding Buttons

Add buttons to your keyboard using the `addButton` method:

```php
$keyboard->addButton('Button Text');
```

For inline keyboards, you can specify callback data:

```php
$keyboard->addButton('Button Text', 'callback_data');
```

### Setting Keyboard Type

Specify the type of keyboard:

```php
$keyboard->inline(); // For inline keyboards
$keyboard->reply();  // For reply keyboards (default)
$keyboard->forceReply(); // For force reply
$keyboard->remove(); // To remove the keyboard
```

### Customizing Layout

Control the layout and behavior:

```php
$keyboard->oneTime(); // Hide keyboard after one use
$keyboard->resize();  // Resize keyboard to fit content
$keyboard->selective(); // Show keyboard only to specific users
```

### Building the Keyboard

Once configured, build the keyboard array:

```php
$keyboardArray = $keyboard->build();
```

<a name="use-in-templates"></a>
## Use In Templates

In your Template templates, you can easily render keyboards using the `@keyboard` directive:

```blade
@keyboard($keyboard)
```

You can also pass keyboard options directly:

```blade
@keyboard([
    ['text' => 'Button 1', 'callback_data' => 'action1'],
    ['text' => 'Button 2', 'callback_data' => 'action2']
], 'inline')
```

This allows for seamless integration of keyboards into your bot's responses within templates.
