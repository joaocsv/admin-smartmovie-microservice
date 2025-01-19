import { UuidValueObject } from '../../shared/value-object/uuid.value.object'

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
    return new Category({
      name: command.name,
      description: command.description,
      isActive: command.isActive
    });
  }

  changeName(name: string): void {
    this.name = name;
  }

  changeDescription(description: string): void {
    this.description = description;
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
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