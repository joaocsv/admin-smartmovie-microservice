import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { Category } from "./category";
import { ValidatorFields } from "../../shared/domain/validators/validator.fields";

//criar um testes que verifique os decorators
export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  constructor({ name, description, isActive }: Category) {
    Object.assign(this, { name, description, isActive });
  }
}

export class CategoryValidator extends ValidatorFields<CategoryRules> {
  validate(entity: Category) {
    return super.validate(new CategoryRules(entity));
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}