import { NedotoApiResponseInterface } from './NedotoApiResponseInterface';

export class ResponseValidator {
  private readonly json: NedotoApiResponseInterface;
  private readonly allowedTypeValues = [
    'string',
    'int',
    'float',
    'bool',
    'json',
    'code',
    'html',
  ];

  constructor(json: NedotoApiResponseInterface) {
    this.json = json;
  }

  public validate(): string[] {
    const errors = [];

    if (!this.json.variable) {
      errors.push('Property "variable" is required and must not be null');
    } else if (!this.json.variable.data) {
      errors.push('Property "variable.data" is required and must not be null');
    } else if (
      !this.json.variable.data.type ||
      this.json.variable.data.type.length === 0
    ) {
      errors.push(
        'Property "variable.data.type" is required, must not be null and must be a non-empty string',
      );
    } else if (!this.allowedTypeValues.includes(this.json.variable.data.type)) {
      errors.push(
        'Property "variable.data.type" must be one of the following values: ' +
          this.allowedTypeValues.join(', '),
      );
    } else if (!this.json.variable.data.value) {
      errors.push(
        'Property "variable.data.value" is required and must not be null',
      );
    } else if (
      !(
        typeof this.json.variable.data.value === 'string' ||
        typeof this.json.variable.data.value === 'number' ||
        typeof this.json.variable.data.value === 'boolean' ||
        typeof this.json.variable.data.value === 'object'
      )
    ) {
      errors.push(
        'Property "variable.data.value" must be a string, number or boolean',
      );
    } else if (!this.json.variable.data.created_at) {
      errors.push(
        'Property "variable.data.created_at" is required and must not be null',
      );
    } else if (isNaN(new Date(this.json.variable.data.created_at).getTime())) {
      errors.push('Property "variable.data.created_at" must be a valid date');
    } else if (!this.json.variable.data.updated_at) {
      errors.push(
        'Property "variable.data.updated_at" is required and must not be null',
      );
    } else if (isNaN(new Date(this.json.variable.data.updated_at).getTime())) {
      errors.push('Property "variable.data.updated_at" must be a valid date');
    }

    return errors;
  }
}
