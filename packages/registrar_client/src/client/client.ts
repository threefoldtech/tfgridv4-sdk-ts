import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Accounts } from "../modules/accounts";
import { Farms } from "../modules/farms";
import { Nodes } from "../modules/nodes";
import { Zos } from "../modules/zos";
import { validateMnemonic } from "bip39";
import { KeypairType } from "@polkadot/util-crypto/types";
import { SUPPORTED_KEYPAIR_TYPES } from "../utils";
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
  mnemonicOrSeed: string;
  keypairType?: KeypairType;
}

export class RegistrarClient extends BaseClient {
  public readonly mnemonicOrSeed: string;
  public readonly keypairType: KeypairType;
  accounts: Accounts;
  farms: Farms;
  nodes: Nodes;
  zos: Zos;

  _validateSeed(seed: string): string {
    if (!seed.startsWith("0x")) {
      seed = `0x${seed}`;
    }
    if (!seed.match(/^0x[a-fA-F0-9]{64}$/)) {
      return "";
    }
    return seed;
  }
  
  constructor({ baseURL, mnemonicOrSeed, keypairType = "sr25519" }: Config) {
    if (!SUPPORTED_KEYPAIR_TYPES.includes(keypairType)) {
      throw new Error(`Unsupported keypair type: ${keypairType}`);
    }
    if (!baseURL) {
      throw new Error("Base URL is required");
    }
    super(baseURL);
    
    if (!validateMnemonic(mnemonicOrSeed)) {
      mnemonicOrSeed = this._validateSeed(mnemonicOrSeed);
    }
    if (!mnemonicOrSeed) {
      throw new Error("Invalid mnemonic or seed");
    }

    this.mnemonicOrSeed = mnemonicOrSeed;
    this.keypairType = keypairType;
    this.accounts = new Accounts(this);
    this.farms = new Farms(this);
    this.nodes = new Nodes(this);
    this.zos = new Zos(this);
  }
}
