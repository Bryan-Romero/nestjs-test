import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { User } from './entities/user.entity';
import { HttpMessage } from 'src/common/enums';
import { PaginationDto } from 'src/common/pagination-dto/pagination.dto';
import { BcryptjsService } from 'src/common/bcryptjs/bcryptjs.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly bcryptjsService: BcryptjsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existUser = await this.userModel.findOne({
      email,
    });

    if (existUser)
      throw new BadRequestException(HttpMessage.USER_ALREADY_EXIST);

    const randomPassword = await this.bcryptjsService.generateRandomPassword();
    console.log(randomPassword);
    const hash = await this.bcryptjsService.hashString(randomPassword);
    const newUser = await this.userModel.create({
      email,
      password: hash,
      ...createUserDto,
    });

    const user = await this.userModel.findOne({ _id: newUser._id });

    return user;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;

    const pipeline: PipelineStage[] = [
      { $match: { active: true } },
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

    return {
      data: result[0].data,
      total_items: result[0].total || 0,
      total_pages: Math.ceil(result[0].total / Number(limit)) || 0,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id, active: true });

    if (!user) {
      throw new BadRequestException(`User ${id} does not exist`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel.findOneAndUpdate(
      {
        _id: id,
        active: true,
      },
      updateUserDto,
      {
        new: true,
      },
    );

    if (!updateUser) {
      throw new BadRequestException(`User ${id} does not exist`);
    }

    return updateUser;
  }

  async remove(id: string) {
    const updateUser = await this.userModel.findOneAndUpdate(
      {
        _id: id,
        active: true,
      },
      {
        active: false,
      },
      {
        new: true,
      },
    );

    if (!updateUser) {
      throw new BadRequestException(`User ${id} does not exist`);
    }

    return { message: HttpMessage.SUCCESS };
  }
}
