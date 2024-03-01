import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiKey } from './common/decorators';
import { LoggingInterceptor, TimeoutInterceptor } from './common/interceptors';

@ApiKey()
@ApiTags('App')
@UseInterceptors(LoggingInterceptor, TimeoutInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Hello World!',
    type: String,
  })
  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }
}
