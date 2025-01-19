import { UuidValueObject } from '../../../shared/value-object/uuid.value.object'
import { Category } from '../category'

describe('Category unit tests', () => {
  describe("constructor", () => {
    test("should create a category with default values", () => {
      const category = new Category({
        name: "Movie",
      });

      expect(category.categoryId).toBeInstanceOf(UuidValueObject);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.isActive).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
    });

    test("should create a category with all values", () => {
      const createdAt = new Date();
      const category = new Category({
        name: "Movie",
        description: "Movie description",
        isActive: false,
        createdAt,
      });
      expect(category.categoryId).toBeInstanceOf(UuidValueObject);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.isActive).toBeFalsy();
      expect(category.createdAt).toBe(createdAt);
    });
    test("should create a category with name and description", () => {
      const category = new Category({
        name: "Movie",
        description: "Movie description",
      });
  
      expect(category.categoryId).toBeInstanceOf(UuidValueObject);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.isActive).toBeTruthy();
      expect(category.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("create command", () => {
    test("should create a category", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.categoryId).toBeInstanceOf(UuidValueObject);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(true);
      expect(category.createdAt).toBeInstanceOf(Date);
    });

    test("should create a category with description", () => {
      const category = Category.create({
        name: "Movie",
        description: "some description",
      });
      expect(category.categoryId).toBeInstanceOf(UuidValueObject);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("some description");
      expect(category.isActive).toBe(true);
      expect(category.createdAt).toBeInstanceOf(Date);
    });

    test("should create a category with isActive", () => {
      const category = Category.create({
        name: "Movie",
        isActive: false,
      });
      expect(category.categoryId).toBeInstanceOf(UuidValueObject);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(false);
      expect(category.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("category_id field", () => {
    const arrange = [
      { categoryId: null },
      { categoryId: undefined },
      { categoryId: new UuidValueObject() },
    ];
    test.each(arrange)("id = %j", ({ categoryId }) => {
      const category = new Category({
        name: "Movie",
        categoryId: categoryId as any,
      });
      expect(category.categoryId).toBeInstanceOf(UuidValueObject);
      if (categoryId instanceof UuidValueObject) {
        expect(category.categoryId).toBe(categoryId);
      }
    });
  });

  test("should change name", () => {
    const category = Category.create({
      name: "Movie",
    });
    category.changeName("other name");
    expect(category.name).toBe("other name");
  });

  test("should change description", () => {
    const category = Category.create({
      name: "Movie",
    });
    category.changeDescription("some description");
    expect(category.description).toBe("some description");
  });

  test("should active a category", () => {
    const category = Category.create({
      name: "Filmes",
      isActive: false,
    });
    category.activate();
    expect(category.isActive).toBe(true);
  });

  test("should disable a category", () => {
    const category = Category.create({
      name: "Filmes",
      isActive: true,
    });
    category.deactivate();
    expect(category.isActive).toBe(false);
  });
});
