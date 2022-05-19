import { IsString } from 'class-validator';

export class CreateCategoriesPostDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly slug: string;

  @IsString()
  readonly description: string;
}
