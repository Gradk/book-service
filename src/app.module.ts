import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CategoriesPostModule } from './categories_post/categories_post.module';
import { User, UserSchema } from './users/user.models';
import { CompanyModule } from './company/company.module';
import { ServiceModule } from './service/service.module';
import { ServiceCategoryModule } from './service_category/service_category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_NAME_BASE}?retryWrites=true&w=majority`,
      { useNewUrlParser: true },
    ),
    UsersModule,
    AuthModule,
    CategoriesPostModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CompanyModule,
    ServiceModule,
    ServiceCategoryModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
