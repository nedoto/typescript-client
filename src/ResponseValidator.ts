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

    // variable
    if (
      !('variable' in this.json) ||
      this.json.variable === null ||
      this.json.variable === undefined
    ) {
      errors.push('Property "variable" is required and must not be null');
    } else if (
      !('data' in this.json.variable) ||
      this.json.variable.data === null ||
      this.json.variable.data === undefined
    ) {
      errors.push('Property "variable.data" is required and must not be null');
    } else if (
      !('type' in this.json.variable.data) ||
      this.json.variable.data.type === null ||
      this.json.variable.data.type === undefined ||
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
    } else if (
      !('value' in this.json.variable.data) ||
      this.json.variable.data.value === null ||
      this.json.variable.data.value === undefined
    ) {
      errors.push(
        'Property "variable.data.value" is required and must not be null',
      );
    } else if (
      !(
        typeof this.json.variable.data.value === 'string' ||
        typeof this.json.variable.data.value === 'number' ||
        typeof this.json.variable.data.value === 'boolean'
      )
    ) {
      errors.push(
        'Property "variable.data.value" must be a string, number or boolean',
      );
    } else if (
      !('created_at' in this.json.variable.data) ||
      this.json.variable.data.created_at === null ||
      this.json.variable.data.created_at === undefined
    ) {
      errors.push(
        'Property "variable.data.created_at" is required and must not be null',
      );
    } else if (isNaN(new Date(this.json.variable.data.created_at).getTime())) {
      errors.push('Property "variable.data.created_at" must be a valid date');
    } else if (
      !('updated_at' in this.json.variable.data) ||
      this.json.variable.data.updated_at === null ||
      this.json.variable.data.updated_at === undefined
    ) {
      errors.push(
        'Property "variable.data.updated_at" is required and must not be null',
      );
    } else if (isNaN(new Date(this.json.variable.data.updated_at).getTime())) {
      errors.push('Property "variable.data.updated_at" must be a valid date');
    }

    return errors;
  }
}
