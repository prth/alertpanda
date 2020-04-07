import axios from 'axios';
import mkdirp from 'mkdirp';
import * as slack from './slack';
import { ConfigStore } from '../../config.types';

/**
 * Mock `fs` to handle config file reads
 */
let fs;
jest.mock('fs', () => new (require('metro-memory-fs'))());

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('slack', () => {
  beforeAll(() => {
    fs = require('fs');

    const configSample: ConfigStore = {
      project: 'mystery',
      slackWebhook: 'https://hooks.slack.com/services/example/123456',
      tools: [
        { name: 'Kibana', link: 'http://example.com/kibana' },
        { name: 'Newrelic', link: 'http://example.com/newrelic' },
      ],
    };
    mkdirp.sync(process.cwd(), { fs });
    fs.writeFileSync(
      `${process.cwd()}/.alertpandarc`,
      JSON.stringify(configSample)
    );

    require('./../../config').default.init();
    mockedAxios.post.mockResolvedValue({ status: 200 });

    jest.spyOn(Date, 'now').mockReturnValue(1587399600000);
  });

  afterEach(() => {
    mockedAxios.post.mockReset();
  });

  afterAll(() => {
    fs.reset();
    jest.resetModules();
  });

  test('error() should ignore sending with no args passed', async () => {
    await slack.error();

    expect(mockedAxios.post).toBeCalledTimes(0);
  });

  test('error() sends message with error details to slack', async () => {
    const err = new Error('Bad thing happened');
    const stackTraceCopy = err.stack;

    await slack.error('hello world', 'cheeze!', err, [
      { name: 'field1', value: 'text1' },
      { name: 'field2', value: 'text3' },
    ]);

    expect(mockedAxios.post).toBeCalledTimes(1);
    expect(mockedAxios.post.mock.calls[0][0]).toEqual(
      'https://hooks.slack.com/services/example/123456'
    );

    expect(mockedAxios.post.mock.calls[0][1]).toEqual({
      attachments: [
        {
          blocks: [
            {
              fields: [
                {
                  text: '*field1*\ntext1',
                  type: 'mrkdwn',
                },
                { text: '*field2*\ntext3', type: 'mrkdwn' },
              ],
              type: 'section',
            },
            {
              fields: [
                { text: '*Project*\nmystery', type: 'mrkdwn' },
                {
                  text:
                    '*When*\n<!date^1587399600^{date} at {time}|2020-04-20T16:20:00.000Z>',
                  type: 'mrkdwn',
                },
              ],
              type: 'section',
            },
            {
              text: { text: '```' + stackTraceCopy + '```', type: 'mrkdwn' },
              type: 'section',
            },
            { type: 'divider' },
            {
              text: { text: '```cheeze!```', type: 'mrkdwn' },
              type: 'section',
            },
            {
              elements: [
                { text: 'mystery', type: 'mrkdwn' },
                { text: '<http://example.com/kibana|Kibana>', type: 'mrkdwn' },
                {
                  text: '<http://example.com/newrelic|Newrelic>',
                  type: 'mrkdwn',
                },
              ],
              type: 'context',
            },
          ],
          color: '#ef5350',
        },
      ],
      blocks: [
        {
          text: {
            text: ':rotating_light: *hello world*\nError: Bad thing happened',
            type: 'mrkdwn',
          },
          type: 'section',
        },
      ],
    });
  });

  test('error() sends message with error details to slack, even without error object', async () => {
    await slack.error('hello world', 'cheeze!', [
      { name: 'field1', value: 'text1' },
      { name: 'field2', value: 'text3' },
    ]);

    expect(mockedAxios.post).toBeCalledTimes(1);
    expect(mockedAxios.post.mock.calls[0][0]).toEqual(
      'https://hooks.slack.com/services/example/123456'
    );

    expect(mockedAxios.post.mock.calls[0][1]).toEqual({
      attachments: [
        {
          blocks: [
            {
              fields: [
                {
                  text: '*field1*\ntext1',
                  type: 'mrkdwn',
                },
                { text: '*field2*\ntext3', type: 'mrkdwn' },
              ],
              type: 'section',
            },
            {
              fields: [
                { text: '*Project*\nmystery', type: 'mrkdwn' },
                {
                  text:
                    '*When*\n<!date^1587399600^{date} at {time}|2020-04-20T16:20:00.000Z>',
                  type: 'mrkdwn',
                },
              ],
              type: 'section',
            },
            {
              text: { text: '```cheeze!```', type: 'mrkdwn' },
              type: 'section',
            },
            {
              elements: [
                { text: 'mystery', type: 'mrkdwn' },
                { text: '<http://example.com/kibana|Kibana>', type: 'mrkdwn' },
                {
                  text: '<http://example.com/newrelic|Newrelic>',
                  type: 'mrkdwn',
                },
              ],
              type: 'context',
            },
          ],
          color: '#ef5350',
        },
      ],
      blocks: [
        {
          text: {
            text: ':rotating_light: *hello world*',
            type: 'mrkdwn',
          },
          type: 'section',
        },
      ],
    });
  });

  test('info() should ignore sending with no args passed', async () => {
    await slack.info();

    expect(mockedAxios.post).toBeCalledTimes(0);
  });

  test('info() sends info message to slack', async () => {
    await slack.info('hello world', 'louise!', [
      { name: 'field1', value: 'text1' },
      { name: 'field2', value: 'text2' },
    ]);

    expect(mockedAxios.post).toBeCalledTimes(1);
    expect(mockedAxios.post.mock.calls[0][0]).toEqual(
      'https://hooks.slack.com/services/example/123456'
    );

    expect(mockedAxios.post.mock.calls[0][1]).toEqual({
      attachments: [
        {
          blocks: [
            {
              fields: [
                { text: '*field1*\ntext1', type: 'mrkdwn' },
                { text: '*field2*\ntext2', type: 'mrkdwn' },
              ],
              type: 'section',
            },
            {
              text: { text: '```louise!```', type: 'mrkdwn' },
              type: 'section',
            },
            {
              elements: [
                {
                  text:
                    'mystery - <!date^1587399600^{date} at {time}|2020-04-20T16:20:00.000Z>',
                  type: 'mrkdwn',
                },
              ],
              type: 'context',
            },
          ],
        },
      ],
      blocks: [
        { text: { text: 'hello world', type: 'mrkdwn' }, type: 'section' },
      ],
    });
  });
});
