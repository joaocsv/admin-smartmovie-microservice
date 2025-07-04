import { CreatedAt, Sequelize } from "sequelize-typescript";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from '../category.model.mapper'
import { Category } from '../../../../domain/category'
import { Uuid } from '../../../../../shared/domain/value-object/uuid'
import { setupSequelize } from '../../../../../shared/infra/testing/helpers'

describe("CategoryModelMapper Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  it("should throws error when category is invalid", () => {
    const model = CategoryModel.build({
      category_id: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail(
        "The category is valid, but it needs throws a EntityValidationError"
      );
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should convert a category model to a category aggregate", () => {
    const createdAt = new Date();
    const model = CategoryModel.build({
      category_id: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      isActive: true,
      createdAt: createdAt,
    });
    const aggregate = CategoryModelMapper.toEntity(model);
    expect(aggregate.toJSON()).toStrictEqual(
      new Category({
        categoryId: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
        name: "some value",
        description: "some description",
        isActive: true,
        createdAt,
      }).toJSON()
    );
  });

  test("should convert a category aggregate to a category model", () => {
    const createdAt = new Date();
    const aggregate = new Category({
      categoryId: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
      name: "some value",
      description: "some description",
      isActive: true,
      createdAt,
    });
    const model = CategoryModelMapper.toModel(aggregate);
    expect(model.toJSON()).toStrictEqual({
      category_id: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      isActive: true,
      createdAt: createdAt,
    });
  });
});