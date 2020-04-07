# alertpanda

> a very alert panda alerting humans and bots

A simple utility to send Slack alerts for application monitoring.

## Install

```bash
npm install --save alertpanda
```

## Requirements

- node.js `>=8.9.0`

## Usage

```js
const alertpanda = require('alertpanda');

alertpanda.info('The force is strong with this one.');
alertpanda.error('And...here...we...go...', new Error('Introduce a little anarchy...'));
```

## API

### .info(message[, description, fields])

Send info message

### .error(message[, description, fields, error])

Send error message

### fields

```js
{
  fields = [
    {
      name: '',
      value: ''
    }
  ]
}
```

To add context, and breadcrumbs to describe the message

## Config

Add `.alertpandarc` file to your application directory. Supports a JSON or YAML, JS configuration file.

| Prop  | Type | Description | Default
| -------------- | ------------- | ------------- | ------------- |
| project | string | Name of the project | `name` property value from package.json  |
| slackWebhook | string | **Required.** Slack webhook URL |
| tools | Array | Array of tools with name and link, for example Kibana, Newrelic; for adding context to error alerts | []
| tools[].name | string | **Required.** Name of the tool |
| tools[].link | string | **Required.** URL of the tool |

### Sample Config

```js
{
  project: 'mystery',
  slackWebhook: 'https://hooks.slack.com/.....',
  tools: [
    { name: 'Kibana', link: 'https://...' },
    { name: 'Newrelic', link: 'https://...' }
  ]
}
```

### Config using environment variable

Use `.alertpandarc.js` JS config file, to set configs from environment variables

```js

module.exports = {
  project: process.env.APP_NAME,
  slackWebhook: process.env.SLACK_WEBHOOK
}
```

## Examples

### Error message

```js
const error = new Error('Something went wrong in batch to send birthday emails :(');
const fields = [
  {
    name: 'Batch Id',
    value: '9415a1af-f263-44aa-a9a5-90c65a3213ae'
  },
  {
    name: 'Email template Id',
    value: 'a97e6ea8-9fb2-4aaa-88f0-3dade2bbfa0f'
  },
  {
    name: 'Size',
    value: '200',
  },
  {
    name: 'Worker started at',
    value: '2020-04-05T15:15:11.620Z',
  }
]

alertpanda.error('Failure in sending emails', fields, error);
```

<img src="https://user-images.githubusercontent.com/3371270/78508798-450dd680-77a7-11ea-90e6-f5324c4572a6.png" width="700">

<img src="https://user-images.githubusercontent.com/3371270/78508789-2f001600-77a7-11ea-922a-0ec238da2389.png" width="700">

### Info message

```js
const fields = [
  {
    name: 'Batch Id',
    value: '9415a1af-f263-44aa-a9a5-90c65a3213ae'
  },
  {
    name: 'Started At',
    value: '2020-04-05T15:15:11.620Z',
  },
  {
    name: 'Time taken',
    value: '200s',
  },
  {
    name: 'Emails sent',
    value: '450',
  },
]

alertpanda.info('Batch job completed to send reminder emails for renewal', fields);
```

<img src="https://user-images.githubusercontent.com/3371270/78503830-b4270300-7786-11ea-981a-fc73229f52ce.png" width="700">

<img src="https://user-images.githubusercontent.com/3371270/78504006-ed13a780-7787-11ea-9d65-4bbde99e9f5c.png" width="700">
