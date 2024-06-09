export class Configuration {
  private readonly type: string;
  private readonly value: string | number | boolean | object;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;

  constructor(type: string, value: string, createdAt: Date, updatedAt: Date) {
    this.type = type;
    this.value = value;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getType(): string {
    return this.type;
  }

  public getValue(): string | number | boolean | object {
    return this.value;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
