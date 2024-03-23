import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import { ApiKey } from './common/decorators';

@ApiKey()
@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
