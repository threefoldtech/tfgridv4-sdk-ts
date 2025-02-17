import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class RegistrarClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: Config.getInstance().registrarUrl,
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
