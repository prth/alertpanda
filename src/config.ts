import readPkg from 'read-pkg';
import { cosmiconfigSync } from 'cosmiconfig';
import * as constants from './constants';
import { ConfigStore, ToolDetail } from './config.types';

export default class Config {
  private static instance: Config;
  private static tools: ToolDetail[];

  private configStore: ConfigStore;

  private constructor(configStore) {
    this.configStore = configStore;
  }

  private static getInstance(): Config {
    if (!this.instance) {
      throw new Error('Config not initialized');
    }

    return this.instance;
  }

  private static isConfigStoreValid(configStore: ConfigStore): boolean {
    if (!configStore || !configStore.slackWebhook) {
      return false;
    }

    return true;
  }

  private static getConfigFromRcFile(): ConfigStore {
    const explorerSync = cosmiconfigSync(constants.APP_NAME);
    const searchResult = explorerSync.search();

    if (!searchResult) {
      throw new Error('Config not found');
    }

    return searchResult.config as ConfigStore;
  }

  public static init(): void {
    if (this.instance) {
      console.log('Config is already initialized');
      return;
    }

    const configStore = this.getConfigFromRcFile();

    if (!this.isConfigStoreValid(configStore)) {
      throw new Error('Invalid config');
    }

    if (!configStore.project) {
      try {
        const packageJSONDetails = readPkg.sync();
        configStore.project = packageJSONDetails.name;
      } catch (err) {}
    }

    this.instance = new Config(configStore);
  }

  public static getConfig(): ConfigStore {
    return this.getInstance().configStore;
  }

  public static getProjectName(): string {
    return Config.getConfig().project;
  }

  // TODO consider alternate module for tools
  private static initTools(): void {
    const tools: ToolDetail[] = [];
    const configStore = this.getConfig();

    if (configStore.tools && configStore.tools.length) {
      configStore.tools.forEach((tool) => {
        if (tool && tool.name && tool.link) {
          tools.push(tool);
        }
      });
    }

    this.tools = tools;
  }

  public static getToolDetailsFromConfig(): ToolDetail[] {
    if (!this.tools) {
      this.initTools();
    }

    return this.tools;
  }
}
