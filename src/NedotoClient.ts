import { Configuration } from './Configuration';
import { Response } from './Response';
import { ResponseValidator } from './ResponseValidator';
import { NedotoCallbackInterface } from './NedotoCallbackInterface';
import Pusher from 'pusher-js';
import { NedotoApiResponseInterface } from './NedotoApiResponseInterface';

export default class NedotoClient {
  private readonly endpoint: string = 'https://app.nedoto.com/api/get/';
  private readonly apiKey: string;
  private readonly nedotoWsAuthEndpoint: string =
    'https://app.nedoto.com/api/ws/auth';
  private readonly soketiEndpoint: string = 'soketi.nedoto.com';
  private readonly soketiPort: number = 6001;

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

  public listen(
    channelKey: string,
    channelName: string,
    callbacks: NedotoCallbackInterface,
  ): () => void {
    if (channelKey.length === 0) {
      throw new Error('Param key is required and must be a non-empty string');
    }

    if (channelName.length === 0) {
      throw new Error(
        'Param channelName is required and must be a non-empty string',
      );
    }

    const pusher = new Pusher(channelKey, {
      wsHost: this.soketiEndpoint,
      wsPort: this.soketiPort,
      forceTLS: false,
      enableStats: true,
      enabledTransports: ['ws', 'wss'],
      cluster: '',
      authEndpoint: this.nedotoWsAuthEndpoint,
      auth: {
        headers: {
          'X-Api-Key': this.apiKey,
          'Access-Control-Allow-Origin': '*',
        },
      },
    });

    const channel = pusher.subscribe(channelName);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.bind('variable-pushed', (data: any) => {
      const apiResponse: NedotoApiResponseInterface = {
        variable: { data: data },
      };

      const errors = new ResponseValidator(apiResponse).validate();

      if (errors.length > 0) {
        if (callbacks.onError) {
          callbacks.onError(new Response(400, errors, null));
        }
      } else {
        const response = new Response(
          200,
          errors,
          new Configuration(
            apiResponse.variable.data.type,
            apiResponse.variable.data.value,
            new Date(apiResponse.variable.data.created_at),
            new Date(apiResponse.variable.data.updated_at),
          ),
        );
        if (callbacks.onVariablePushed) {
          callbacks.onVariablePushed(response);
        }
      }
    });

    channel.bind('pusher:subscription_succeeded', () => {
      if (callbacks.onSubscriptionSucceeded) {
        callbacks.onSubscriptionSucceeded();
      }
    });

    channel.bind('pusher:subscription_error', (error: Response) => {
      if (callbacks.onSubscriptionError) {
        callbacks.onSubscriptionError(error);
      }
    });

    // Return a function to unsubscribe
    return () => {
      pusher.unsubscribe(channelName);
    };
  }
}
