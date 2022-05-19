import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriesPostDto } from './create-categories_post.dto';

export class UpdateCategoriesPostDto extends PartialType(CreateCategoriesPostDto) {}



