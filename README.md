# Nedoto Typescript Client

[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE) [![ci](https://github.com/nedoto/typescript-client/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/nedoto/typescript-client/actions/workflows/ci.yml)

Official Typescript package to connect to Nedoto API.

References:

- Nedoto website: https://nedoto.com
- Nedoto app website: https://app.nedoto.com
- Nedoto documentation website: https://docs.nedoto.com

## Installation

This package requires `Node.js >=14.0.0` and is built for `Typescript >=4.0.0` or higher.

Installation with npm:

```shell
npm install nedoto
```

## Usage

To retrieve your configuration from Nedoto API you should create a new instance of the `NedotoClient` and then use the
Client to retrieve your configuration with the unique variable slug configured in Nedoto.

The response object is of type `Response` and with it, you can retrieve the `Configuration` object.

From the configuration object you can access your configuration value calling the `getValue()` method.

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient();

nedotoClient.get('your-slug').then((response) => {
  const configuration = response.getConfiguration();
  console.log(configuration.getValue()); // will print the value of the Configuration saved in https://app.nedoto.com/variables
});
```

## The Nedoto Response

After calling the `get()` method with the Nedoto client, you'll receive a `Response` object.

### Understand if everything is ok

To understand if everything went fine after retrieving your configuration, you should use the `getStatus()` method.

It will return a standard HTTP status.

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient();

nedotoClient.get('your-slug').then((response) => {
  console.log(response.getStatus()); // ex. 200 HTTP status code
});
```

Alternatively you could you use the `failed()` method that will inform you if there was a failure by returning a boolean
value if the HTTP status code is different from 200 (HTTP OK).

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient();

nedotoClient.get('your-slug').then((response) => {
  console.log(response.failed()); // ex. true if HTTP status is different from 200
});
```

### Understand the errors

After checking if the status of the `Response` you may want to understand which errors happened during the API request.

For this you could use the `getErrors()` method.

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient();

nedotoClient.get('your-slug').then((response) => {
  console.log(response.getErrors());
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

const nedotoClient = new NedotoClient();

nedotoClient.get('your-slug').then((response) => {
  const configuration = response.getConfiguration();
  console.log(configuration.getValue()); // will print the value of the Configuration saved in https://app.nedoto.com/variables
});
```

### Understand the configuration type

When you define a configuration in Nedoto you must define the `type` of your configuration or variable.

To retrieve the configuration `type` you should use the `getType()` method.

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient();

nedotoClient.get('your-slug').then((response) => {
  const configuration = response.getConfiguration();
  console.log(configuration.getType()); // this will print the type of the configuration saved in https://app.nedoto.com/variables, ex. 'string', 'int', 'json', etc.
});
```

### Access the creation date?

By using the `getCreatedAt()` you can access the creation `Date` of the configuration.

```typescript
import NedotoClient from 'nedoto-client';

const nedotoClient = new NedotoClient();

nedotoClient.get('your-slug').then((response) => {
  const configuration = response.getConfiguration();
  console.log(configuration.getCreatedAt()); // ex. 2024-02-12T16:09:21+00:00
});
```

# Want to improve something?

Please feel free to open a PR if you want to improve something on this package.
