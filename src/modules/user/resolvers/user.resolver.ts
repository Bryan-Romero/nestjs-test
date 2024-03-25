import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApiKey, GetUser, JwtAuth } from 'src/common/decorators';
import { PaginationDto } from 'src/common/dtos';
import { Role } from 'src/common/enums';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { CreateUserDto } from '../dto/create-user.dto';
import { FindAllResDto } from '../dto/find-all-res.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiKey()
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @JwtAuth()
  @Query(() => FindAllResDto)
  findAllUsers(
    @Args('paginationDto') paginationDto: PaginationDto,
  ): Promise<FindAllResDto> {
    return this.userService.findAll(paginationDto);
  }

  @JwtAuth()
  @Query(() => User)
  findUserById(@Args('id', ParseObjectIdPipe) _id: string): Promise<User> {
    return this.userService.findOne(_id);
  }

  @JwtAuth()
  @Mutation(() => User)
  updateUser(
    @Args('id', ParseObjectIdPipe) id: string,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @JwtAuth(Role.ADMIN)
  @Mutation(() => User)
  createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @JwtAuth()
  @Query(() => User)
  me(@GetUser('_id', ParseObjectIdPipe) _id: string): Promise<User> {
    return this.userService.me(_id);
  }
}
