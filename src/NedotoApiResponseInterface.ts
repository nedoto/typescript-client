export interface NedotoApiResponseInterface {
  variable: {
    data: {
      type: string;
      value: string | number | boolean | object;
      created_at: string;
      updated_at: string;
    };
  };
}
