export interface ToolDetail {
  name: string;
  link: string;
}

export interface ConfigStore {
  project?: string;
  slackWebhook: string;
  tools?: ToolDetail[];
}
