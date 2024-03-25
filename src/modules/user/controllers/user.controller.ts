import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiKey, Auth, GetUser, JwtAuth } from 'src/common/decorators';
import { MessageResDto, PaginationDto } from 'src/common/dtos';
import { Role } from 'src/common/enums';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { CreateUserDto } from '../dto/create-user.dto';
import { FindAllResDto } from '../dto/find-all-res.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiKey()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new user',
    type: User,
  })
  @Auth(Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all users',
    type: FindAllResDto,
  })
  @Auth()
  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<FindAllResDto> {
    return this.userService.findAll(paginationDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user information authentication',
    type: User,
  })
  @JwtAuth()
  @Get('me')
  me(@GetUser('_id') _id: string): Promise<User> {
    return this.userService.me(_id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user by id',
    type: User,
  })
  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update user by id',
    type: User,
  })
  @Auth(Role.USER)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete user by id',
    type: MessageResDto,
  })
  @Auth(Role.USER)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string): Promise<MessageResDto> {
    return this.userService.remove(id);
  }
}
