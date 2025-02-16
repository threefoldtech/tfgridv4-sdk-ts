import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Config from "../configs/config";

class Client {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = Config.REGISTRAR_NODE_CLIENT || "") {
    if (!baseURL) {
      throw new Error("REGISTRAR_NODE_CLIENT is not defined.");
    }
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>("GET", url, undefined, config);
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>("POST", url, data, config);
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>("PUT", url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>("DELETE", url, undefined, config);
  }

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request<T>({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error(`Error with ${method} request to ${url}:`, error);
      throw error;
    }
  }
}

export default new Client();
