import { EntityValidationError } from '../../shared/domain/validators/validation.error'
import { UuidValueObject } from '../../shared/domain/value-object/uuid.value.object'
import { CategoryValidatorFactory } from './category.validator'

export type CategoryProperties = {
  categoryId?: UuidValueObject;
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: Date;
}

export type CreateCategoryCommand = {
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export class Category {
  categoryId: UuidValueObject;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;

  constructor (properties: CategoryProperties) {
    this.categoryId = properties.categoryId ?? new UuidValueObject();
    this.name = properties.name;
    this.description = properties.description ?? null;
    this.isActive = properties.isActive ?? true;
    this.createdAt = properties.createdAt ?? new Date();
  }

  public static create (command: CreateCategoryCommand): Category {
    const category = new Category({
      name: command.name,
      description: command.description,
      isActive: command.isActive
    });
    Category.validate(category);
    return category;
  }

  changeName(name: string): void {
    this.name = name;
    Category.validate(this);
  }

  changeDescription(description: string): void {
    this.description = description;
    Category.validate(this);
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  static validate(entity: Category) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(entity);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  toJson() {
    return {
      categoryId: this.categoryId,
      name: this.name,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt
    }
  }
}