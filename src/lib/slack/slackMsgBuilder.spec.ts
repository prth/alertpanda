import * as slackMsgBuilder from './slackMsgBuilder';

describe('slackMsgBuilder', () => {
  test('getMarkdownText() returns valid markdown text response', () => {
    const res = slackMsgBuilder.getMarkdownText(
      "they don't want us to win so we gonna win more"
    );

    expect(res.type).toEqual('mrkdwn');
    expect(res.text).toEqual("they don't want us to win so we gonna win more");
  });

  test('getTextBlock() returns valid text block response', () => {
    const res = slackMsgBuilder.getTextBlock('a man must have a code');

    expect(res.type).toEqual('section');
    expect(res.text).toEqual({
      type: 'mrkdwn',
      text: 'a man must have a code',
    });
  });

  test('getMultilineTextBlock() returns valid multiline text block response', () => {
    const res = slackMsgBuilder.getMultilineTextBlock(
      'stairway to heaven or highway to hell or both?'
    );

    expect(res.type).toEqual('section');
    expect(res.text).toEqual({
      type: 'mrkdwn',
      text: '```stairway to heaven or highway to hell or both?```',
    });
  });

  test('getFieldMarkdownText() returns valid markdown response for a field type', () => {
    const res = slackMsgBuilder.getFieldMarkdownText({
      name: 'who',
      value: 'phil dunphy... yo',
    });

    expect(res.type).toEqual('mrkdwn');
    expect(res.text).toEqual('*who*\nphil dunphy... yo');
  });

  test('getFieldsBlock() returns valid fields block response', () => {
    const res = slackMsgBuilder.getFieldsBlock([
      { name: 'who', value: 'adele' },
      { name: 'is she the best?', value: 'yes' },
      { name: 'hello?', value: 'hello from the outside' },
    ]);

    expect(res.type).toEqual('section');
    expect(res.fields).toEqual([
      { type: 'mrkdwn', text: '*who*\nadele' },
      { type: 'mrkdwn', text: '*is she the best?*\nyes' },
      { type: 'mrkdwn', text: '*hello?*\nhello from the outside' },
    ]);
  });

  test('getContextBlock() returns valid context block response', () => {
    const res = slackMsgBuilder.getContextBlock([
      'foo fighters',
      'learn to fly',
      'break a leg',
    ]);

    expect(res.type).toEqual('context');
    expect(res.elements).toEqual([
      { type: 'mrkdwn', text: 'foo fighters' },
      { type: 'mrkdwn', text: 'learn to fly' },
      { type: 'mrkdwn', text: 'break a leg' },
    ]);
  });

  test('getDividerBlock() returns basic divider block response', () => {
    const res = slackMsgBuilder.getDividerBlock();

    expect(res.type).toEqual('divider');
  });

  test('parseToDateString() returns valid parsed date string response', () => {
    const inputDate = new Date('2020-04-20T16:20:00.000Z');
    const res = slackMsgBuilder.parseToDateString(inputDate);

    expect(res).toEqual(
      '<!date^1587399600^{date} at {time}|2020-04-20T16:20:00.000Z>'
    );
  });

  test('parseToLinkString() returns valid parsed link string response', () => {
    const res = slackMsgBuilder.parseToLinkString(
      'hello example',
      'https://example.com'
    );

    expect(res).toEqual('<https://example.com|hello example>');
  });

  test('parseToErrorTitleString() returns valid parsed error title response, with both msg, err params', () => {
    const inputErr = new Error('What can go wrong?');
    const res = slackMsgBuilder.parseToErrorTitleString(
      'Something went wrong!',
      inputErr
    );

    expect(res).toEqual(
      ':rotating_light: *Something went wrong!*\nError: What can go wrong?'
    );
  });

  test('parseToErrorTitleString() returns valid parsed error title response, with only err param', () => {
    const inputErr = new Error('What can go wrong?');
    const res = slackMsgBuilder.parseToErrorTitleString(null, inputErr);

    expect(res).toEqual(':rotating_light: *Error: What can go wrong?*');
  });

  test('parseToMultilineString() returns valid multiline text string response', () => {
    const res = slackMsgBuilder.parseToMultilineString(
      'its called a satchel. indiana jones wears one.'
    );

    expect(res).toEqual('```its called a satchel. indiana jones wears one.```');
  });
});
