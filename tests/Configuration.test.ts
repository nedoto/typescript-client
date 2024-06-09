import { Configuration } from '../src/Configuration';

describe('Configuration', () => {
  it('creates a Configuration object with valid parameters', () => {
    const configuration = new Configuration(
      'string',
      'test-value',
      new Date('2022-01-01T00:00:00Z'),
      new Date('2022-01-01T00:00:00Z'),
    );

    expect(configuration).toBeInstanceOf(Configuration);
    expect(configuration.getType()).toBe('string');
    expect(configuration.getValue()).toBe('test-value');
    expect(configuration.getCreatedAt()).toEqual(
      new Date('2022-01-01T00:00:00Z'),
    );
    expect(configuration.getUpdatedAt()).toEqual(
      new Date('2022-01-01T00:00:00Z'),
    );
  });
});
