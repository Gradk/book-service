import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  USER_SUCCESSFULLY_DELETED,
  USER_SUCCESSFULLY_UPD,
} from './user.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put('update/:id')
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const currentUser = await this.usersService.updateUser(id, updateUserDto);
      return response.status(HttpStatus.OK).json({
        message: USER_SUCCESSFULLY_UPD,
        currentUser,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async remove(@Res() response, @Param('id') id: string) {
    try {
      const deletedUser = await this.usersService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: USER_SUCCESSFULLY_DELETED,
        deletedUser,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/show')
  getProfile(@Request() req) {
    return req.user;
  }
}
