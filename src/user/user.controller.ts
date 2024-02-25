import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseMongoIdPipe } from 'src/common/pipes';
import { Auth, GetUser, JwtAuth } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { PaginationDto, MessageResDto } from 'src/common/dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindAllResDto } from './dto/find-all-res.dto';
import { User } from './entities/user.entity';
import { MeResDto } from './dto/me-res.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new user',
    type: CreateUserDto,
  })
  @Auth(Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
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
    type: MeResDto,
  })
  @JwtAuth()
  @Get('me')
  me(@GetUser('_id') _id: string): Promise<MeResDto> {
    return this.userService.me(_id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user by id',
    type: User,
  })
  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string): Promise<User> {
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
    @Param('id', ParseMongoIdPipe) id: string,
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
  remove(@Param('id', ParseMongoIdPipe) id: string): Promise<MessageResDto> {
    return this.userService.remove(id);
  }
}
