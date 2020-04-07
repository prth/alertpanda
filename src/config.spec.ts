/**
 * Mock `fs` to handle config file reads
 */
jest.mock('fs', () => new (require('metro-memory-fs'))());
jest.mock('console');

import mkdirp from 'mkdirp';

describe('config', () => {
  let fs;

  beforeEach(() => {
    fs = require('fs');

    const configSample = {
      project: 'mystery',
      slackWebhook: 'https://example.com',
    };
    mkdirp.sync(process.cwd(), { fs });
    fs.writeFileSync(
      `${process.cwd()}/.alertpandarc`,
      JSON.stringify(configSample)
    );

    jest.spyOn(fs, 'readFileSync');
    jest.spyOn(global.console, 'log');
  });

  afterEach(() => {
    fs.reset();
    jest.resetAllMocks();
    jest.resetModules();
  });

  test('getConfig() returns the entire config response for the APP', () => {
    const Config = require('./config').default;
    Config.init();
    const res = Config.getConfig();

    expect(res).toEqual({
      project: 'mystery',
      slackWebhook: 'https://example.com',
    });
    expect(fs.readFileSync).toBeCalledTimes(2);
  });

  test('getConfig() should throw error if config if not initalized', () => {
    const Config = require('./config').default;
    expect(() => {
      Config.getConfig();
    }).toThrowError(new Error('Config not initialized'));
  });

  test('getProjectName() should return project value from config', () => {
    const Config = require('./config').default;
    Config.init();
    const res = Config.getProjectName();

    expect(res).toEqual('mystery');
  });

  test('getProjectName() should return `name` from package.json as default', () => {
    fs.writeFileSync(
      `${process.cwd()}/package.json`,
      JSON.stringify({
        name: 'some-awesome-project',
      })
    );

    const configWithoutProjectSample = {
      slackWebhook: 'https://example.com',
    };
    fs.writeFileSync(
      `${process.cwd()}/.alertpandarc`,
      JSON.stringify(configWithoutProjectSample)
    );

    const Config = require('./config').default;
    Config.init();
    const res = Config.getProjectName();

    expect(res).toEqual('some-awesome-project');

    fs.unlinkSync(`${process.cwd()}/package.json`);
  });

  test('init() should initialize only once, and should not repeat file repeats for config files', () => {
    const Config = require('./config').default;
    Config.init();

    /**
     * 2 file read operations are done by the `cosmiconfig` library,
     * to find the ".alertpandarc" file, thats declared in the tests mock
     */
    expect(fs.readFileSync).toBeCalledTimes(2);

    Config.init();
    Config.init();

    // even after calling init() multiple times, it should not increase file read operations;
    expect(fs.readFileSync).toBeCalledTimes(2);
    expect(console.log).toBeCalledTimes(2);
  });

  test('init() should initialize with invalid config', () => {
    fs.writeFileSync(
      `${process.cwd()}/.alertpandarc`,
      JSON.stringify({ invalid: 'config' })
    );
    const Config = require('./config').default;

    expect(() => {
      Config.init();
    }).toThrowError(new Error('Invalid config'));
  });

  test('init() should initialize and throw not found error with missing file', () => {
    fs.unlinkSync(`${process.cwd()}/.alertpandarc`);
    const Config = require('./config').default;

    expect(() => {
      Config.init();
    }).toThrowError(new Error('Config not found'));
  });
});
