import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { User } from './entities/user.entity';
import { HttpMessage, Role } from 'src/common/enums';
import { PaginationDto } from 'src/common/pagination-dto/pagination.dto';
import { BcryptjsService } from 'src/common/bcryptjs/bcryptjs.service';
import { FindAllResDto } from './dto-res/find-all-res.dto';
import { MessageResDto } from 'src/common/message-res-dto/message-res.dto';
import { plainToClass } from 'class-transformer';
import { FindOneResDto } from './dto-res/find-one-res.dto';

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
      throw new BadRequestException(HttpMessage.USER_ALREADY_EXIST);

    const randomPassword = await this.bcryptjsService.generateRandomPassword();
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

    return plainToClass(CreateUserDto, user);
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

  async findOne(id: string): Promise<FindOneResDto> {
    const user = await this.userModel.findOne({ _id: id, active: true });

    if (!user) {
      throw new BadRequestException(`User ${id} does not exist`);
    }

    return plainToClass(FindOneResDto, user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
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

    return plainToClass(UpdateUserDto, updateUser);
  }

  async remove(id: string): Promise<MessageResDto> {
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
