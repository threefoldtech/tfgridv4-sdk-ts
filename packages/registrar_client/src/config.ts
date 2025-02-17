export class Config {
  private static _instance: Config;
  public readonly registrarUrl: string;

  private constructor() {
    this.registrarUrl = process.env.REGISTRAR_URL || "";
  }

  public static getInstance(): Config {
    if (!Config._instance) {
      Config._instance = new Config();
    }
    return Config._instance;
  }
}
