import { Response } from './Response';

export interface NedotoCallbackInterface {
  onVariablePushed?: (response: Response) => void;
  onError?: (error: Response) => void;
  onSubscriptionSucceeded?: () => void;
  onSubscriptionError?: (error: Response) => void;
}
