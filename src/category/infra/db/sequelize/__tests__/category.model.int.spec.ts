import { DataType, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { setupSequelize } from '../../../../../shared/infra/testing/helpers'

describe("CategoryModel Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });
  
  test("mapping props", () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());

    expect(attributes).toStrictEqual([
      "category_id",
      "name",
      "description",
      "isActive",
      "createdAt",
    ]);

    const categoryIdAttr = attributesMap.category_id;
    expect(categoryIdAttr).toMatchObject({
      field: "category_id",
      fieldName: "category_id",
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: "name",
      fieldName: "name",
      allowNull: false,
      type: DataType.STRING(255),
    });

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      field: "description",
      fieldName: "description",
      allowNull: true,
      type: DataType.TEXT(),
    });

    const isActiveAttr = attributesMap.isActive;
    expect(isActiveAttr).toMatchObject({
      field: "isActive",
      fieldName: "isActive",
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    const createdAtAttr = attributesMap.createdAt;
    expect(createdAtAttr).toMatchObject({
      field: "createdAt",
      fieldName: "createdAt",
      allowNull: false,
      type: DataType.DATE(3),
    });
  });

  test("create", async () => {
    const arrange = {
      category_id: "9366b7dc-2d71-4799-b91c-c64adb205104",
      name: "test",
      isActive: true,
      createdAt: new Date(),
    };
    const category = await CategoryModel.create(arrange);
    expect(category.toJSON()).toStrictEqual(arrange);
  });
});