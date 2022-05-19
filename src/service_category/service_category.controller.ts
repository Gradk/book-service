import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ServiceCategoryService } from './service_category.service';
import { ServiceCategoryDto } from './dto/service_category.dto';
import { SERVICE_CAT_SUCCESSFULLY_DELETED } from './service_category.constants';

@Controller('service-category')
export class ServiceCategoryController {
  constructor(private readonly serviceCategoryService: ServiceCategoryService) {}

  @Post('create')
  create(@Body() dto: ServiceCategoryDto) {
    return this.serviceCategoryService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.serviceCategoryService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string): object {
    return this.serviceCategoryService.findOneId(id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() dto: ServiceCategoryDto) {
    return this.serviceCategoryService.update(id, dto);
  }

  @Delete('/:id')
  async remove(@Res() response, @Param('id') id: string) {
    try {
      const deletedCat = await this.serviceCategoryService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: SERVICE_CAT_SUCCESSFULLY_DELETED,
        deletedCat
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
