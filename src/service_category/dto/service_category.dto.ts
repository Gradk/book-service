import { IsString, IsArray } from 'class-validator';

export class ServiceCategoryDto {
  @IsString()
  readonly name: string;

  @IsArray()
  readonly services: number;
}
