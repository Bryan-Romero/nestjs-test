import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingInterceptor, TimeoutInterceptor } from './common/interceptors';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

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
