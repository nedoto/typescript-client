import { Response } from '../src/Response';
import { Configuration } from '../src/Configuration';

describe('Response', () => {
  it('creates a Response object with null Configuration when the response is not ok', () => {
    const response = new Response(500, ['Error 1', 'Error 2'], null);

    expect(response).toBeInstanceOf(Response);
    expect(response.getConfiguration()).toBeNull();
    expect(response.getErrors().length).toBeGreaterThan(0);
    expect(response.failed()).toBe(true);
  });

  it('creates a Response object with valid parameters', () => {
    const configuration = new Configuration(
      'string',
      'test-value',
      new Date('2022-01-01T00:00:00Z'),
      new Date('2022-01-01T00:00:00Z'),
    );

    const response = new Response(
      200,
      [],
      new Configuration(
        'string',
        'test-value',
        new Date('2022-01-01T00:00:00Z'),
        new Date('2022-01-01T00:00:00Z'),
      ),
    );

    expect(response).toBeInstanceOf(Response);
    expect(response.getStatus()).toBe(200);
    expect(response.getErrors()).toEqual([]);
    expect(response.failed()).toBe(false);
    expect(response.getConfiguration()).toEqual(configuration);
  });
});
