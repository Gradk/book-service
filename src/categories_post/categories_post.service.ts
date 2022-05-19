import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoriesPostDto } from './dto/create-categories_post.dto';
import { UpdateCategoriesPostDto } from './dto/update-categories_post.dto';
import {
  CategoriesPost,
  CategoriesPostDocument,
} from './categories_post.models';
import {
  ALREADY_POST_REGISTERED_ERROR,
  CATEGORY_NOT_FOUNd_ERROR,
} from './categories_post.constants';

const cyrillicToTranslit = require('cyrillic-to-translit-js');

@Injectable()
export class CategoriesPostService {
  constructor(
    @InjectModel(CategoriesPost.name)
    private CategoriesPostModel: Model<CategoriesPostDocument>,
  ) {}

  async create(dto: CreateCategoriesPostDto) {
    const oldCategoryName = await this.CategoriesPostModel.findOne({
      name: dto.name,
    }).exec();
    if (oldCategoryName) {
      throw new BadRequestException(ALREADY_POST_REGISTERED_ERROR);
    }

    //сгенерировать слаг
    let generateSlug = cyrillicToTranslit({ preset: 'ru' })
      .transform(`${dto.name}`, '_')
      .toLowerCase();

    //проверить слаг на уникальность
    let oldSlug = await this.CategoriesPostModel.findOne({
      slug: generateSlug,
    }).exec();
    if (oldSlug) {
      let counter = 1;
      while (oldSlug) {
        counter++;

        generateSlug = `generateSlug${counter}`;

        oldSlug = await this.CategoriesPostModel.findOne({
          slug: generateSlug,
        }).exec();
      }
    }

    const newCategoriesPost = new this.CategoriesPostModel({
      name: dto.name,
      slug: generateSlug,
      description: dto.description,
    });
    return newCategoriesPost.save();
  }

  findAll() {
    return this.CategoriesPostModel.find().exec();
  }

  async findOneId(id: string) {
    const category_post = await this.CategoriesPostModel.findById(id).exec();
    if (!category_post) {
      throw new NotFoundException(CATEGORY_NOT_FOUNd_ERROR);
    }
    return category_post;
  }

  async findOneBySlug(slug: string) {
    const category_post = await this.CategoriesPostModel.findOne({
      slug: slug,
    }).exec();
    if (!category_post) {
      throw new NotFoundException(CATEGORY_NOT_FOUNd_ERROR);
    }
    return category_post;
  }

  async update(id: string, dto: UpdateCategoriesPostDto) {
    const existsPostCat = await this.CategoriesPostModel.findById(id).exec();

    if (existsPostCat) {
      //сгенерировать слаг
      let generateSlug = cyrillicToTranslit({ preset: 'ru' })
        .transform(`${dto.name}`, '_')
        .toLowerCase();

      //если слаг менялся, то ищем есть ли уже такой
      if (existsPostCat.slug !== dto.slug) {
        //проверить слаг на уникальность
        let oldSlug = await this.CategoriesPostModel.findOne({
          slug: generateSlug,
        }).exec();
        if (oldSlug) {
          let counter = 1;
          while (oldSlug) {
            counter++;

            generateSlug = `${generateSlug}${counter}`;

            oldSlug = await this.CategoriesPostModel.findOne({
              slug: generateSlug,
            }).exec();
          }
        }

        if (existsPostCat.name == dto.name) {
          throw new NotFoundException(ALREADY_POST_REGISTERED_ERROR);
        }
      }

      const currentCat = await this.CategoriesPostModel.findByIdAndUpdate(
        id,
        {
          name: dto.name,
          slug: generateSlug,
          description: dto.description,
        },
        {
          new: true,
        },
      );
      return currentCat;
    } else {
      throw new NotFoundException(CATEGORY_NOT_FOUNd_ERROR);
    }
  }

  async remove(id: string): Promise<CategoriesPost> {
    const deletedCat = await this.CategoriesPostModel.findByIdAndRemove(
      id,
    ).exec();
    if (!deletedCat) {
      throw new NotFoundException(CATEGORY_NOT_FOUNd_ERROR);
    }
    return deletedCat;
  }
}
