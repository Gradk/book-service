import { CreateServiceDto } from './dto/create-service.dto';
import { Service, ServiceDocument } from './service-model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ALREADY_SERVICE_REGISTERED_ERROR, SERVICE_NOT_FOUNd_ERROR } from './service.constants';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class ServiceService {
  static clearCategory(name: string) {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectModel(Service.name) private ServiceModel: Model<ServiceDocument>) {}

  async create(dto: CreateServiceDto) {
    const oldService = await this.ServiceModel.findOne({
      name: dto.name
    }).exec();

    if (oldService) {
      throw new BadRequestException(ALREADY_SERVICE_REGISTERED_ERROR);
    }
    const newService = new this.ServiceModel({
      name: dto.name,
      price: dto.price,
      duration: dto.duration,
      category: dto.category
    });
    return newService.save();
  }

  findAll() {
    return this.ServiceModel.find().exec();
  }

  async findOneId(id: string) {
    const service = await this.ServiceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException(SERVICE_NOT_FOUNd_ERROR);
    }
    return service;
  }

  async update(id: string, dto: CreateServiceDto) {
    const existsService = await this.ServiceModel.findById(id).exec();

    if (existsService) {
      //если название меняется ищем дубликаты по названию услуги
      if (existsService.name !== dto.name) {
        let duplicateNameService = await this.ServiceModel.findOne({
          name: dto.name
        }).exec();

        if (duplicateNameService) {
          throw new NotFoundException(ALREADY_SERVICE_REGISTERED_ERROR);
        }
      }

      const currentService = await this.ServiceModel.findByIdAndUpdate(
        id,
        {
          name: dto.name,
          price: dto.price,
          duration: dto.duration,
          category: dto.category
        },
        {
          new: true
        }
      );
      return currentService;
    } else {
      throw new NotFoundException(SERVICE_NOT_FOUNd_ERROR);
    }
  }

  async remove(id: string): Promise<Service> {
    const deletedService = await this.ServiceModel.findByIdAndRemove(id).exec();
    if (!deletedService) {
      throw new NotFoundException(SERVICE_NOT_FOUNd_ERROR);
    }
    return deletedService;
  }

  //очистка категории услуги после удалении категории
  async clearCategory(nameCategory: string): Promise<any> {
    console.log('test1');
    return '';
  }
}
