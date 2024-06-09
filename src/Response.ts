import { Configuration } from './Configuration';

export class Response {
  private readonly status: number;
  private readonly errors: string[];
  private readonly configuration: Configuration | null;

  constructor(
    status: number,
    errors: string[] = [],
    configuration: Configuration | null,
  ) {
    this.status = status;
    this.errors = errors;
    this.configuration = configuration;
  }

  public getStatus(): number {
    return this.status;
  }

  public getErrors(): string[] {
    return this.errors;
  }

  public failed(): boolean {
    return this.errors.length > 0;
  }

  public getConfiguration(): Configuration | null {
    return this.configuration;
  }
}
