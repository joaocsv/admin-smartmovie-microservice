import { FieldsErrors } from './shared/domain/validators/validation.fields.interface'

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsErrors) => R;
    }
  }
}