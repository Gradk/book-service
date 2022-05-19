import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesPostService } from './categories_post.service';
import { CreateCategoriesPostDto } from './dto/create-categories_post.dto';
import { UpdateCategoriesPostDto } from './dto/update-categories_post.dto';
import { CAT_SUCCESSFULLY_DELETED } from './categories_post.constants';

@Controller('categories-post')
export class CategoriesPostController {
  constructor(private readonly categoriesPostService: CategoriesPostService) {}

  @Post('create')
  createPost(@Body() createCategoriesPostDto: CreateCategoriesPostDto) {
    return this.categoriesPostService.create(createCategoriesPostDto);
  }

  @Get('all')
  findAll() {
    return this.categoriesPostService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string): object {
    return this.categoriesPostService.findOneId(id);
  }

  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string): object {
    return this.categoriesPostService.findOneBySlug(slug);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoriesPostDto: UpdateCategoriesPostDto,
  ) {
    return this.categoriesPostService.update(id, updateCategoriesPostDto);
  }

  @Delete('/:id')
  async remove(@Res() response, @Param('id') id: string) {
    try {
      const deletedCat = await this.categoriesPostService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: CAT_SUCCESSFULLY_DELETED,
        deletedCat,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
