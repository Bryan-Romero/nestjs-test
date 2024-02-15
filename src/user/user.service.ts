import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { HttpMessage, Role } from 'src/common/enums';
import { PaginationDto, MessageResDto } from 'src/common/dto';
import { BcryptjsService } from 'src/common/bcryptjs/bcryptjs.service';
import { FindAllResDto } from './dto/find-all-res.dto';
import { generateRandomPassword } from 'src/common/utils/generate-random-pass';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
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

  async me(_id: string): Promise<User> {
    const user = await this.findOneByIdVerifyExist(_id);

    return user;
  }

  async findOne(_id: string): Promise<User> {
    const user = await this.findOneByIdVerifyExist(_id);

    return user;
  }

  async update(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneByIdVerifyExist(_id);

    const { age, username } = updateUserDto;
    user.age = age;
    user.username = username;
    await user.save();

    return user;
  }

  async remove(_id: string): Promise<MessageResDto> {
    const user = await this.findOneByIdVerifyExist(_id);

    user.active = false;
    await user.save();

    return { message: HttpMessage.SUCCESS };
  }

  async findOneByIdVerifyExist(_id: string | Types.ObjectId): Promise<User> {
    const user = await this.userModel.findOne({ _id, active: true });

    if (!user) {
      console.log(`User with _id ${_id} does not exist`);
      throw new NotFoundException(
        HttpMessage.NOT_FOUND,
        `User with _id ${_id} does not exist`,
      );
    }

    return user;
  }
}
