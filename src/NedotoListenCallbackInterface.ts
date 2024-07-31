import { Response } from './Response';

export interface NedotoListenCallbackInterface {
  onConfigurationReceived?: (response: Response) => void;
  onError?: (error: Response) => void;
  onChannelSubscriptionSucceeded?: () => void;
  onChannelSubscriptionError?: (error: Response) => void;
}
