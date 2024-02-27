import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PipelineStage, ProjectionType } from 'mongoose';
import { User, UserDocument, UserModel } from './entities/user.entity';
import { HttpMessage, Role } from 'src/common/enums';
import { PaginationDto, MessageResDto } from 'src/common/dto';
import { BcryptjsService } from 'src/common/bcryptjs/bcryptjs.service';
import { FindAllResDto } from './dto/find-all-res.dto';
import { generateRandomPassword } from 'src/common/utils/generate-random-pass';
import { UserRequest } from 'src/common/interfaces';
import { MeResDto } from './dto/me-res.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private readonly bcryptjsService: BcryptjsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const { email } = createUserDto;
    const existUser = await this.userModel.findOne({
      email,
    });

    if (existUser)
      throw new ConflictException(
        HttpMessage.CONFLICT,
        `User ${existUser.email} already exists`,
      );

    const randomPassword = generateRandomPassword(12);
    console.log(randomPassword);
    const hash = await this.bcryptjsService.hashData(randomPassword);
    const newUser = await this.userModel.create({
      email,
      password: hash,
      ...createUserDto,
    });

    const user = await this.userModel.findOne(
      { _id: newUser._id },
      {
        active: 0,
      },
    );

    return user;
  }

  async findAll(paginationDto: PaginationDto): Promise<FindAllResDto> {
    const { limit = 10, page = 1 } = paginationDto;

    const pipeline: PipelineStage[] = [
      { $match: { active: true, roles: { $in: [Role.USER] } } },
      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { $project: { password: 0, roles: 0, active: 0 } },
          ],
          totalCount: [{ $count: 'total' }],
        },
      },
      {
        $unwind: {
          path: '$totalCount',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          total: '$totalCount.total',
        },
      },
      {
        $project: {
          totalCount: 0,
        },
      },
    ];

    const result = await this.userModel.aggregate(pipeline);
    const users = result[0].data;

    return {
      data: users,
      total_items: result[0].total || 0,
      total_pages: Math.ceil(result[0].total / Number(limit)) || 0,
    };
  }

  async me(_id: string): Promise<MeResDto> {
    const user = await this.findUserById({ _id });

    return user;
  }

  async findOne(_id: string): Promise<User> {
    const user = await this.findUserById({ _id });

    return user;
  }

  async update(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById({ _id });

    const { age, username } = updateUserDto;
    user.age = age;
    user.username = username;
    await user.save();

    return user;
  }

  async remove(_id: string): Promise<MessageResDto> {
    const user = await this.findUserById({ _id });

    user.active = false;
    await user.save();

    return { message: HttpMessage.SUCCESS };
  }

  async validateUser(email: string, password: string): Promise<UserRequest> {
    const user = await this.userModel.findOne(
      { email, active: true },
      {
        age: true,
        email: true,
        username: true,
        password: true,
      },
    );
    if (user) {
      // Validate password
      const isPasswordValid = await this.bcryptjsService.compareStringHash(
        password,
        user.password,
      );

      const { _id, roles, username } = user;
      return isPasswordValid ? { _id, email, roles, username } : null;
    }

    return null;
  }

  async findUserByEmail(props: {
    email: string;
    projection?: ProjectionType<User>;
    whitException?: boolean;
  }): Promise<UserDocument> {
    const { email, projection, whitException = true } = props;
    const user = await this.userModel.findOne(
      { email, active: true },
      projection,
    );

    if (!user && whitException)
      throw new NotFoundException(
        HttpMessage.NOT_FOUND,
        `User with email ${email} does not exist`,
      );

    return user || null;
  }

  async findUserById(props: {
    _id: string;
    projection?: ProjectionType<User>;
    whitException?: boolean;
  }): Promise<UserDocument> {
    const { _id, projection, whitException = true } = props;
    const user = await this.userModel.findOne(
      { _id, active: true },
      projection,
    );

    if (!user && whitException)
      throw new NotFoundException(
        HttpMessage.NOT_FOUND,
        `User with _id ${_id} does not exist`,
      );

    return user || null;
  }
}
