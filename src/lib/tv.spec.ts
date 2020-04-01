import * as tv from './tv';

it('getTopTVShows() returns top 3 shows', () => {
  const res = tv.getTopTVShows(3);
  expect(res.length).toBe(3);
});
