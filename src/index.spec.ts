/* eslint-disable @typescript-eslint/no-var-requires */
import * as alertpanda from './index';

jest.mock('./lib/slack/slack');
jest.mock('./boot');
jest.mock('console');

const slack = require('./lib/slack/slack');

describe('alertpanda', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  test('info() should invoke slack log, and pass on the arguments', () => {
    slack.info.mockResolvedValue();

    alertpanda.info('hello man', 'blah');
    expect(slack.info).toBeCalledTimes(1);
    expect(slack.info.mock.calls[0]).toEqual(['hello man', 'blah']);
  });

  test('error() should invoke slack log, and pass on the arguments', () => {
    slack.error.mockResolvedValue();

    alertpanda.error('hello man', 'error');
    expect(slack.error).toBeCalledTimes(1);
    expect(slack.error.mock.calls[0]).toEqual(['hello man', 'error']);
  });

  test('info() should not throw error, even if slack.info() fails', async () => {
    slack.info.mockRejectedValue(new Error('something went wrong man'));

    await alertpanda.info('hello man', 'yolo');

    expect(console.error).toBeCalledTimes(1);
  });

  test('error() should not throw error, even if slack.error() fails', async () => {
    slack.error.mockRejectedValue(new Error('something went wrong man'));

    await alertpanda.error('hello man', 'errorrblah');

    expect(console.error).toBeCalledTimes(1);
  });

  test('error() should not throw error, even if slack.error() fails', () => {
    const boot = require('./boot');
    boot.init.mockImplementation(() => {
      throw new Error('well damn');
    });

    require('./index');

    expect(console.error).toBeCalledTimes(1);
  });
});
