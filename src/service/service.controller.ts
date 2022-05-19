import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { SERVICE_SUCCESSFULLY_DELETED } from './service.constants';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('create')
  create(@Body() dto: CreateServiceDto) {
    return this.serviceService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.serviceService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string): object {
    return this.serviceService.findOneId(id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() dto: CreateServiceDto) {
    return this.serviceService.update(id, dto);
  }

  @Delete('/:id')
  async remove(@Res() response, @Param('id') id: string) {
    try {
      const deletedCat = await this.serviceService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: SERVICE_SUCCESSFULLY_DELETED,
        deletedCat
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
