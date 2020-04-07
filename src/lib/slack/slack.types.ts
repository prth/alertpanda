export enum BlockType {
  section = 'section',
  context = 'context',
  divider = 'divider',
}

export enum TextType {
  mrkdwn = 'mrkdwn',
}

export enum Color {
  danger = '#ef5350',
}

export interface LogNotifyArgs {
  text?: string;
  desc?: string;
  fields?: Field[];
}

export interface ErrorNotifyArgs {
  text?: string;
  desc?: string;
  fields?: Field[];
  error?: Error;
}

export interface Field {
  name: string;
  value: string;
}

export interface Text {
  type: TextType;
  text: string;
}

export interface Block {
  type: BlockType;
}

export interface TextBlock extends Block {
  text: Text;
}

export interface FieldsBlock extends Block {
  fields: Text[];
}

export interface ContextBlock extends Block {
  elements: Text[];
}
