import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PipelineStage, ProjectionType } from 'mongoose';
import { BcryptjsService } from 'src/modules/bcryptjs/bcryptjs.service';
import { MessageResDto, PaginationDto } from 'src/common/dtos';
import { ExceptionMessage, Role, StandardMessage } from 'src/common/enums';
import { UserRequest } from 'src/common/interfaces';
import { generateRandomPassword } from 'src/common/utils/generate-random-pass';
import { CreateUserDto } from '../dto/create-user.dto';
import { FindAllResDto } from '../dto/find-all-res.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserDocument, UserModel } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private readonly bcryptjsService: BcryptjsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const findUser = await this.userModel.findOne({
      email,
    });

    if (findUser)
      throw new ConflictException(
        `User ${findUser.email} already exists`,
        ExceptionMessage.CONFLICT,
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
    const { limit, offset } = paginationDto;

    const pipeline: PipelineStage[] = [
      { $match: { active: true, roles: { $in: [Role.USER] } } },
      {
        $facet: {
          data: [
            { $skip: offset },
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

  async me(_id: string): Promise<User> {
    const user = await this.findUserById(_id);

    return user;
  }

  async findOne(_id: string): Promise<User> {
    const user = await this.findUserById(_id);

    return user;
  }

  async update(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(_id);

    const { age, username } = updateUserDto;
    user.age = age ?? user.age;
    user.username = username ?? user.username;
    await user.save();

    return user;
  }

  async remove(_id: string): Promise<MessageResDto> {
    const user = await this.findUserById(_id);

    user.active = false;
    await user.save();

    return { message: StandardMessage.SUCCESS };
  }

  async validateUser(email: string, password: string): Promise<UserRequest> {
    const user = await this.userModel.findOne(
      { email, active: true },
      '+password',
    );
    if (user) {
      // Validate password
      const isPasswordValid = await this.bcryptjsService.compareStringHash(
        password,
        user.password,
      );

      return isPasswordValid
        ? {
            _id: user._id,
            email: user.email,
            roles: user.roles,
            username: user.username,
          }
        : null;
    }

    return null;
  }

  async findUserByEmail(
    email: string,
    projection?: ProjectionType<User>,
    whitException = true,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne(
      { email, active: true },
      projection,
    );

    if (!user && whitException)
      throw new NotFoundException(
        `User with email ${email} does not exist`,
        ExceptionMessage.NOT_FOUND,
      );

    return user || null;
  }

  async findUserById(
    _id: string,
    projection?: ProjectionType<User>,
    whitException = true,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne(
      { _id, active: true },
      projection,
    );

    if (!user && whitException)
      throw new NotFoundException(
        `User with _id ${_id} does not exist`,
        ExceptionMessage.NOT_FOUND,
      );

    return user || null;
  }
}
