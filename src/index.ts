import * as boot from './boot';
import * as slack from './lib/slack/slack';
import { Field } from './lib/slack/slack.types';

export async function info(...args: (string | Field[])[]): Promise<void> {
  // TODO consider refactoring this, had having common error handling
  await slack.info(...args).catch((err) => {
    console.error('alertpanda failed to send info message :(', err);
  });
}

export async function error(
  ...args: (string | Error | Field[])[]
): Promise<void> {
  await slack.error(...args).catch((err) => {
    console.error('alertpanda failed to send error message :(', err);
  });
}

try {
  boot.init();
} catch (err) {
  console.error('alertpanda failed to initialize :(', err);
}
