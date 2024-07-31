import { Configuration } from './Configuration';
import { Response } from './Response';
import { ResponseValidator } from './ResponseValidator';
import { NedotoListenCallbackInterface } from './NedotoListenCallbackInterface';
import { NedotoApiResponseInterface } from './NedotoApiResponseInterface';
import Pusher from 'pusher-js';

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
      return Promise.reject(
        NedotoClient.createResponse(response.status, json, null),
      );
    }

    const errors = new ResponseValidator(json).validate();

    if (errors.length > 0) {
      return Promise.reject(NedotoClient.createResponse(400, errors, null));
    }

    return NedotoClient.createResponse(response.status, errors, json);
  }

  public listen(
    channelKey: string,
    channelName: string,
    channelCallback: NedotoListenCallbackInterface,
  ): () => void {
    if (channelKey.length === 0) {
      throw new Error(
        'Param channelKey is required and must be a non-empty string',
      );
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

      // there are some errors in the api response
      if (errors.length > 0) {
        if (channelCallback.onError) {
          channelCallback.onError(
            NedotoClient.createResponse(400, errors, null),
          );
        }
      } else {
        const response = NedotoClient.createResponse(200, errors, apiResponse);

        // the configuration is received from Nedoto
        if (channelCallback.onConfigurationReceived) {
          channelCallback.onConfigurationReceived(response);
        }
      }
    });

    channel.bind('pusher:subscription_succeeded', () => {
      // the communication channel with Nedoto is active
      if (channelCallback.onChannelSubscriptionSucceeded) {
        channelCallback.onChannelSubscriptionSucceeded();
      }
    });

    channel.bind('pusher:subscription_error', (error: Response) => {
      // there are some errors connecting to Nedoto
      if (channelCallback.onChannelSubscriptionError) {
        channelCallback.onChannelSubscriptionError(error);
      }
    });

    // Return a function to unsubscribe
    return () => {
      pusher.unsubscribe(channelName);
    };
  }

  private static createResponse(
    httpStatusCode: number,
    errors: string[],
    apiResponse: NedotoApiResponseInterface | null,
  ): Response {
    return new Response(
      httpStatusCode,
      errors,
      NedotoClient.createConfiguration(apiResponse),
    );
  }

  private static createConfiguration(
    apiResponse: NedotoApiResponseInterface | null,
  ): Configuration | null {
    if (!apiResponse) {
      return null;
    }

    return new Configuration(
      apiResponse.variable.data.type,
      apiResponse.variable.data.value,
      new Date(apiResponse.variable.data.created_at),
      new Date(apiResponse.variable.data.updated_at),
    );
  }
}
