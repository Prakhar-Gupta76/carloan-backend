import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

@Injectable()
export class AxiosHelper {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }
}
