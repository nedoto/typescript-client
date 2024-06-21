import { Configuration } from './Configuration';
import { Response } from './Response';
import { ResponseValidator } from './ResponseValidator';

export default class NedotoClient {
  private readonly endpoint: string = 'https://app.nedoto.com/api/var/get/';
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (apiKey.length === 0) {
      throw new Error(
        'Param apiKey is required and must be a non-empty string',
      );
    }

    this.apiKey = apiKey;
  }

  public async get(slug: string): Promise<Response> {
    if (slug.length === 0) {
      throw new Error('Param slug is required and must be a non-empty string');
    }

    const response = await fetch(`${this.endpoint}${slug}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      return Promise.reject(new Response(response.status, json, null));
    }

    const errors = new ResponseValidator(json).validate();

    if (errors.length > 0) {
      return Promise.reject(new Response(400, errors, null));
    }

    return new Response(
      response.status,
      errors,
      new Configuration(
        json.variable.data.type,
        json.variable.data.value,
        new Date(json.variable.data.created_at),
        new Date(json.variable.data.updated_at),
      ),
    );
  }
}
