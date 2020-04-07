import * as boot from './boot';

jest.mock('./config');

test('boot.init() should invoke config init, and not throw config error', () => {
  boot.init();
});
