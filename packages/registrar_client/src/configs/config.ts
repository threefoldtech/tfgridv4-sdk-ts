import fs from "fs";
import path from "path";

class Config {
  private static instance: Config;
  public readonly NETWORK: string;
  public REGISTRAR_NODE_CLIENT: string;

  private constructor() {
    const configPath = path.join(__dirname, "../../config.json");

    if (!fs.existsSync(configPath)) {
      throw new Error("config.json file is missing.");
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    if (!config.NETWORK) {
      throw new Error("NETWORK is required in config.json.");
    }

    this.NETWORK = config.NETWORK;
    this.REGISTRAR_NODE_CLIENT =
      config.REGISTRAR_NODE_CLIENT || this.setDefaultUrl();
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private setDefaultUrl(): string {
    const defaultUrls: { [key: string]: string } = {
      dev: "https://registrar.dev4.grid.tf/v1",
      main: "https://registrar.prod4.grid.tf/v1",
    };

    if (!defaultUrls[this.NETWORK]) {
      throw new Error(`No default URL found for network: ${this.NETWORK}`);
    }

    return defaultUrls[this.NETWORK];
  }
}

export default Config.getInstance();
