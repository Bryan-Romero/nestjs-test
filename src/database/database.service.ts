import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import {
  ConfigurationType,
  DatabaseType,
} from 'src/config/configuration.interface';

@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
  constructor(
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}

  createMongooseOptions(): MongooseModuleOptions {
    const uri = this.configService.get<DatabaseType>('database').uri;

    return {
      uri,
    };
  }
}
