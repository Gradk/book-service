import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceCategoryDto } from './dto/service_category.dto';
import { ServiceCategory, ServiceCategoryDocument } from './service_category.models';
import { ALREADY_SERVICE_CAT_REGISTERED_ERROR, SERVICE_CAT_NOT_FOUNd_ERROR } from './service_category.constants';
import { ServiceService } from '../service/service.service';

@Injectable()
export class ServiceCategoryService {
  constructor(@InjectModel(ServiceCategory.name) private ServiceCategoryModel: Model<ServiceCategoryDocument>) {}

  async create(dto: ServiceCategoryDto) {
    const oldServiceCategory = await this.ServiceCategoryModel.findOne({
      name: dto.name
    }).exec();

    if (oldServiceCategory) {
      throw new BadRequestException(ALREADY_SERVICE_CAT_REGISTERED_ERROR);
    }
    const newServiceCategory = new this.ServiceCategoryModel({
      name: dto.name,
      services: dto.services
    });
    return newServiceCategory.save();
  }

  async findAll() {
    const allServiceCategory = await this.ServiceCategoryModel.find().exec();
    return allServiceCategory;
  }

  async findOneId(id: string) {
    const serviceCategory = await this.ServiceCategoryModel.findById(id).exec();
    if (!serviceCategory) {
      throw new NotFoundException(SERVICE_CAT_NOT_FOUNd_ERROR);
    }
    return serviceCategory;
  }

  async update(id: string, dto: ServiceCategoryDto) {
    const existsServiceCategory = await this.ServiceCategoryModel.findById(id).exec();

    if (existsServiceCategory) {
      //если название меняется ищем дубликаты по названию услуги
      if (existsServiceCategory.name !== dto.name) {
        let duplicateNameServiceCategory = await this.ServiceCategoryModel.findOne({
          name: dto.name
        }).exec();

        if (duplicateNameServiceCategory) {
          throw new NotFoundException(ALREADY_SERVICE_CAT_REGISTERED_ERROR);
        }
      }

      const currentServiceCategory = await this.ServiceCategoryModel.findByIdAndUpdate(
        id,
        {
          name: dto.name,
          services: dto.services
        },
        {
          new: true
        }
      );
      return currentServiceCategory;
    } else {
      throw new NotFoundException(SERVICE_CAT_NOT_FOUNd_ERROR);
    }
  }

  async remove(id: string): Promise<ServiceCategory> {
    const deletedServiceCategory = await this.ServiceCategoryModel.findByIdAndRemove(id).exec();
    if (!deletedServiceCategory) {
      throw new NotFoundException(SERVICE_CAT_NOT_FOUNd_ERROR);
    }
    //тут надо еще в коллекции услуг найти услуги с этой категорией
    // и заменить на пустую

    // const servicesThisCategory = await ServiceService.clearCategory(deletedServiceCategory.name);

    return deletedServiceCategory;
  }
}
