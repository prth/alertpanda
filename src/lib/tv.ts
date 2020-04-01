const TOP_SHOWS: Array<string> = [
  'The Wire',
  'Breaking Bad',
  'Seinfeld',
  'The Office',
  "It's Always Sunny in Philadelphia",
];

/**
 * Returns TOP TV shows, why not :)
 * https://youtu.be/dQw4w9WgXcQ
 *
 * @param count - number of TV shows
 * @returns array of top tv shows
 */
export function getTopTVShows(count: number): Array<string> {
  return TOP_SHOWS.slice(0, count);
}
