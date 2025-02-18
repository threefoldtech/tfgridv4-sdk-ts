import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Accounts } from "../modules/account/service";
import { Farms } from "../modules/farm/service";
import { Nodes } from "../modules/node/service";
import { Zos } from "../modules/zos/service";

export abstract class BaseClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: baseURL,
    });
  }

  async get<T>(uri: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(uri, config);
    return response.data;
  }

  async post<T>(uri: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(uri, data, config);
    return response.data;
  }

  async patch<T>(uri: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(uri, data, config);
    return response.data;
  }

  async put<T>(uri: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(uri, data, config);
    return response.data;
  }
}
interface Config {
  baseURL: string;
  privateKey: string;
}

export class RegistrarClient extends BaseClient {
  public readonly privateKey: string;
  accounts: Accounts;
  farms: Farms;
  nodes: Nodes;
  zos: Zos;

  constructor({ baseURL, privateKey }: Config) {
    if (!baseURL) {
      throw new Error("Base URL is required");
    }
    if (!privateKey) {
      throw new Error("Private key is required");
    }
    super(baseURL);
    this.privateKey = privateKey;
    this.accounts = new Accounts(this);
    this.farms = new Farms(this);
    this.nodes = new Nodes(this);
    this.zos = new Zos(this);
  }
}
