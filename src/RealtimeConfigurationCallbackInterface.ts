import { Response } from './Response';

export interface RealtimeConfigurationCallbackInterface {
  // triggered when the configuration is received from the Nedoto
  onConfigurationReceived?: (response: Response) => void;

  // triggered when the subscription to the channel is successful
  onChannelSubscriptionSucceeded?: () => void;

  // triggered when the subscription to the channel fails
  onChannelSubscriptionError?: (error: Response) => void;

  // triggered when there is a generic error
  onError?: (error: Response) => void;
}
