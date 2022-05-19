import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesPostService } from './categories_post.service';
import { CategoriesPostController } from './categories_post.controller';
import {CategoriesPost, CategoriesPostSchema} from './categories_post.models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CategoriesPost.name, schema: CategoriesPostSchema }]),
  ],
  controllers: [CategoriesPostController],
  providers: [CategoriesPostService]
})
export class CategoriesPostModule {}
