# Nedoto Typescript Client

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE) [![ci](https://github.com/nedoto/typescript-client/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/nedoto/typescript-client/actions/workflows/ci.yml)

Official Typescript package to connect to Nedoto API.

References:

- Nedoto website: https://nedoto.com
- Nedoto app website: https://app.nedoto.com
- Nedoto documentation website: https://docs.nedoto.com

## Installation

Installation with npm:

```shell
npm install nedoto-client
```

## How to retrieve your configuration?

With Nedoto you can retrieve your configuration in two ways:

- sync
- async

### Sync

To retrieve your configuration synchronously you should use the `get()` method.

In this way an HTTP GET call will be made to Nedoto and your configuration will be retrieved.

### Async

To retrieve your configuration asynchronously you should use the `listen()` method.

By using the listen() method you are opening a WebSocket connection with Nedoto and you will be listening to any
real-time push events sent from Nedoto.

## Usage

The simplest way to retrieve your configuration from Nedoto API you should create a new instance of the `NedotoClient`
and then use the
Client to retrieve your configuration with the unique configuration slug configured in Nedoto.

The response object is of type `Response` and with it, you can retrieve the `Configuration` object.

From the configuration object you can access your configuration value calling the `getValue()` method.

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient('your-api-key');

nedotoClient.get('your-slug').then((response) => {
    const configuration = response.getConfiguration();
    console.log(configuration.getValue()); // will print the value of the Configuration saved in https://app.nedoto.com/configurations
}).catch((error) => {
    console.error(error);
})
```

## The Nedoto Response

After calling the `get()` method with the Nedoto client, you'll receive a `Response` object.

### Understand if everything is ok

To understand if everything went fine after retrieving your configuration, you should use the `getStatus()` method.

It will return a standard HTTP status.

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient('your-api-key');

nedotoClient.get('your-slug').then((response) => {
    console.log(response.getStatus()); // ex. 200 HTTP status code
}).catch((error) => {
    console.error(error);
});
```

Alternatively you could you use the `failed()` method that will inform you if there was a failure by returning a boolean
value if the HTTP status code is different from 200 (HTTP OK).

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient('your-api-key');

nedotoClient.get('your-slug').then((response) => {
    console.log(response.failed()); // ex. true if HTTP status is different from 200
}).catch((error) => {
    console.error(error);
});
```

### Understand the errors

After checking if the status of the `Response` you may want to understand which errors happened during the API request.

For this you could use the `getErrors()` method.

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient('your-api-key');

nedotoClient.get('your-slug').then((response) => {
    console.log(response.getErrors());
}).catch((error) => {
    console.error(error);
});
```

the `getErrors()` method will return an array of reasons explaining why:

```typescript
[
    'Error message 1',
    'Error message 2',
    'Error message 3',
    // ...
];
```

### Retrieve the Configuration

To retrieve your configuration value you must use the `getConfiguration()` method.

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient('your-api-key');

nedotoClient.get('your-slug').then((response) => {
    const configuration = response.getConfiguration();
    console.log(configuration.getValue()); // will print the value of the Configuration saved in https://app.nedoto.com/configurations
}).catch((error) => {
    console.error(error);
});
```

### Understand the configuration type

When you define a configuration in Nedoto you must define the `type` of your configuration.

To retrieve the configuration `type` you should use the `getType()` method.

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient('your-api-key');

nedotoClient.get('your-slug').then((response) => {
    const configuration = response.getConfiguration();
    console.log(configuration.getType()); // this will print the type of the configuration saved in https://app.nedoto.com/configurations, ex. 'string', 'int', 'json', etc.
}).catch((error) => {
    console.error(error);
});
```

### Access the creation date?

By using the `getCreatedAt()` you can access the creation `Date` of the configuration.

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient('your-api-key');

nedotoClient.get('your-slug').then((response) => {
    const configuration = response.getConfiguration();
    console.log(configuration.getCreatedAt()); // ex. 2024-02-12T16:09:21+00:00
}).catch((error) => {
    console.error(error);
});
```

## Listen for real-time updates

If you are planning to use the real-time feature of Nedoto you should use the `listen()` method.

This feature is an async method that will open a WebSocket connection with Nedoto and you will be listening to any
real-time push events sent from Nedoto.

It can be usefult when you to implement push notification, enabled or disable a feature in real-time, change your app
settings in real-time, etc.

Note: the Response object is the same as the `get()` method.

To let this example work you should have an active Configuration in Nedoto, and by accessing the Configuration details,
you should be able to retrieve:

- `api-key` (this is your api key needed to authenticate to Nedoto)
- `key` (this is your key needed to listen to the real-time updates)
- `channel-name` (this is your channel name where your real-time updates will be sent)

```typescript
import NedotoClient from "nedoto-client";
import {Response} from "nedoto-client/dist/cjs/Response";

const nedotoClient = new NedotoClient('your-api-key');

const unsubscribeCallback = nedotoClient.listen(
    'your-key',
    'your-channel-name', {

        // will be called when the configuration is received
        onConfigurationReceived: (response: Response) => {
            console.log('Configuration received:', response);
        },

        // will be called when the connection to Nedoto is established
        onChannelSubscriptionSucceeded: () => {
            console.log('Subscription succeeded');
        },

        // will be called when there are connection errors
        onChannelSubscriptionError: (error: Response) => {
            console.error('Subscription error:', error);
        },

        // will be called when there are generic errors
        onError: (error: Response) => {
            console.error('Error:', error);
        }
    }
);
```

If you want to stop listening to the real-time updates just call the `unsubscribeCallback` function:

```typescript
unsubscribeCallback();
```

# Want to improve something?

Please feel free to open a PR if you want to improve something on this package.
