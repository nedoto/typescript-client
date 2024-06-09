import { NedotoClient } from '../src/NedotoClient';

describe('NedotoClient', () => {
  let client: NedotoClient;

  beforeEach(() => {
    client = new NedotoClient('test-api-key');
    global.fetch = jest.fn();
  });

  it('throws an error when apiKey is empty', () => {
    expect(() => new NedotoClient('')).toThrow(
      'Param apiKey is required and must be a non-empty string',
    );
  });

  it('throws an error when slug is empty', async () => {
    await expect(client.get('')).rejects.toThrow(
      'Param slug is required and must be a non-empty string',
    );
  });

  it('returns a Response with errors when API returns non-200 status', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => 'Not Found',
    });

    const response = await client.get('test-slug');

    expect(response.getStatus()).toBe(404);
    expect(response.failed()).toEqual(true);
    expect(response.getErrors()).toEqual(['Not Found']);
    expect(response.getConfiguration()).toBeNull();
  });

  it('returns a Response with Configuration when API returns 200 status and valid data', async () => {
    const mockData = {
      variable: {
        data: {
          type: 'string',
          value: 'test-value',
          created_at: '2022-01-01T00:00:00Z',
          updated_at: '2022-01-01T00:00:00Z',
        },
      },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const response = await client.get('test-slug');

    expect(response.getStatus()).toBe(200);
    expect(response.getErrors()).toEqual([]);
    expect(response.failed()).toEqual(false);
    expect(response.getConfiguration()).not.toBeNull();
    expect(response.getConfiguration()?.getType()).toBe('string');
    expect(response.getConfiguration()?.getValue()).toBe('test-value');
  });
});
