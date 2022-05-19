import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceCategoryService } from './service_category.service';
import { ServiceCategoryController } from './service_category.controller';
import { ServiceService } from 'src/service/service.service';
import { ServiceCategory, ServiceCategorySchema } from './service_category.models';

@Module({
  imports: [MongooseModule.forFeature([{ name: ServiceCategory.name, schema: ServiceCategorySchema }]), ServiceService],
  controllers: [ServiceCategoryController],
  providers: [ServiceCategoryService],
  exports: [ServiceCategoryService]
})
export class ServiceCategoryModule {}
