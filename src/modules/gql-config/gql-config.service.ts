import {
  ApolloServerErrorCode,
  unwrapResolverError,
} from '@apollo/server/errors';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { join } from 'path';
import { ConfigurationType } from 'src/config/configuration.interface';
import { NodeEnv } from 'src/config/node-env.enum';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}

  createGqlOptions(): ApolloDriverConfig {
    const node_env = this.configService.get<NodeEnv>('node_env');

    return {
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      useGlobalPrefix: true,
      csrfPrevention: true,
      cache: 'bounded',
      plugins: [
        node_env === NodeEnv.PRODUCTION
          ? ApolloServerPluginLandingPageProductionDefault()
          : ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
      formatError: (formattedError, error) => {
        if (node_env === NodeEnv.DEVELOPMENT) {
          console.log(formattedError);
        }

        if (unwrapResolverError(error) instanceof HttpException) {
          return {
            message: formattedError.message,
            code:
              formattedError.extensions?.originalError?.['error'] ??
              ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          };
        } else if (unwrapResolverError(error) instanceof GraphQLError) {
          return {
            message: formattedError.message,
            code: formattedError.extensions.code,
          };
        } else {
          return {
            message: 'Something went wrong',
            code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          };
        }
      },
    };
  }
}
