import { InvalidUuidError, UuidValueObject } from "../uuid.value.object";
import { validate as uuidValidate } from "uuid";
describe("Uuid Unit Tests", () => {
  const validateSpy = jest.spyOn(UuidValueObject.prototype as any, "validate");

  test("should throw error when uuid is invalid", () => {
    expect(() => {
      new UuidValueObject("invalid-uuid");
    }).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should create a valid uuid", () => {
    const uuid = new UuidValueObject();
    expect(uuid.value).toBeDefined();
    expect(uuidValidate(uuid.value)).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should accept a valid uuid", () => {
    const uuid = new UuidValueObject("c3e9b0d0-7b6f-4a8e-8e1f-3f9e6a2f7e3c");
    expect(uuid.value).toBe("c3e9b0d0-7b6f-4a8e-8e1f-3f9e6a2f7e3c");
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});