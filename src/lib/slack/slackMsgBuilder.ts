import {
  Text,
  TextType,
  TextBlock,
  BlockType,
  FieldsBlock,
  Field,
  ContextBlock,
  Block,
} from './slack.types';

export function getMarkdownText(text: string): Text {
  return {
    type: TextType.mrkdwn,
    text: text,
  };
}

export function getTextBlock(text: string): TextBlock {
  return {
    type: BlockType.section,
    text: getMarkdownText(text),
  };
}

export function getMultilineTextBlock(text: string): TextBlock {
  return {
    type: BlockType.section,
    text: getMarkdownText(parseToMultilineString(text)),
  };
}

export function getFieldMarkdownText(field: Field): Text {
  const fieldString = `*${field.name}*\n${field.value}`;

  return getMarkdownText(fieldString);
}

export function getFieldsBlock(fields: Field[]): FieldsBlock {
  return {
    type: BlockType.section,
    fields: fields.map(getFieldMarkdownText),
  };
}

export function getContextBlock(elements: string[]): ContextBlock {
  return {
    type: BlockType.context,
    elements: elements.map(getMarkdownText),
  };
}

export function getDividerBlock(): Block {
  return {
    type: BlockType.divider,
  };
}

export function parseToDateString(dt: Date): string {
  const dtUnix = Math.floor(dt.valueOf() / 1000);
  return `<!date^${dtUnix}^{date} at {time}|${dt.toISOString()}>`;
}

export function parseToLinkString(text: string, url: string): string {
  return `<${url}|${text}>`;
}

export function parseToErrorTitleString(
  customErrMsg: string,
  err: Error
): string {
  let errTitle = ':rotating_light:';

  if (customErrMsg) {
    errTitle += ` *${customErrMsg}*`;
  }

  if (err && err.message) {
    if (customErrMsg) {
      errTitle += `\nError: ${err.message}`;
    } else {
      errTitle += ` *Error: ${err.message}*`;
    }
  }

  return errTitle;
}

export function parseToMultilineString(text: string): string {
  return '```' + text + '```';
}
