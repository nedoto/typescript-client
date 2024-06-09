import { ResponseValidator } from '../src/ResponseValidator';
import { NedotoApiResponseInterface } from '../src/NedotoApiResponseInterface';

describe('ResponseValidator', () => {
  it('returns no errors when JSON object is valid', () => {
    const json: NedotoApiResponseInterface = {
      variable: {
        data: {
          type: 'string',
          value: 'test-value',
          created_at: '2022-01-01T00:00:00Z',
          updated_at: '2022-01-01T00:00:00Z',
        },
      },
    };

    const validator = new ResponseValidator(json);
    const errors = validator.validate();

    expect(errors).toEqual([]);
  });

  test.each([
    ['variable', 'Property "variable" is required and must not be null'],
    [
      'variable.data',
      'Property "variable.data" is required and must not be null',
    ],
    [
      'variable.data.type',
      'Property "variable.data.type" is required, must not be null and must be a non-empty string',
    ],
    [
      'variable.data.value',
      'Property "variable.data.value" is required and must not be null',
    ],
    [
      'variable.data.created_at',
      'Property "variable.data.created_at" is required and must not be null',
    ],
    [
      'variable.data.updated_at',
      'Property "variable.data.updated_at" is required and must not be null',
    ],
  ])(
    'returns errors when JSON object does not have the "%s" param',
    (param, expectedError) => {
      const json: NedotoApiResponseInterface = {
        variable: {
          data: {
            type: 'string',
            value: 'test-value',
            created_at: '2022-01-01T00:00:00Z',
            updated_at: '2022-01-01T00:00:00Z',
          },
        },
      };

      const parts = param.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = json;
      for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
      }
      delete obj[parts[parts.length - 1]];

      const validator = new ResponseValidator(json);
      const errors = validator.validate();

      expect(errors).toContain(expectedError);
    },
  );

  test.each([
    [
      'variable.data.type',
      'invalid-type',
      'Property "variable.data.type" must be one of the following values: string, int, float, bool, json, code, html',
    ],
    [
      'variable.data.value',
      [],
      'Property "variable.data.value" must be a string, number or boolean',
    ],
    [
      'variable.data.value',
      {},
      'Property "variable.data.value" must be a string, number or boolean',
    ],
    [
      'variable.data.created_at',
      'invalid-date',
      'Property "variable.data.created_at" must be a valid date',
    ],
    [
      'variable.data.updated_at',
      'invalid-date',
      'Property "variable.data.updated_at" must be a valid date',
    ],
  ])(
    'returns errors when JSON object have an invalid "%s" param',
    (param, invalidValue, expectedError) => {
      const json: NedotoApiResponseInterface = {
        variable: {
          data: {
            type: 'string',
            value: 'test-value',
            created_at: '2022-01-01T00:00:00Z',
            updated_at: '2022-01-01T00:00:00Z',
          },
        },
      };

      const parts = param.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = json;
      for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = invalidValue;

      const validator = new ResponseValidator(json);
      const errors = validator.validate();

      expect(errors).toContain(expectedError);
    },
  );
});
