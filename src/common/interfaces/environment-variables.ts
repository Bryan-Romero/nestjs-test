export interface EnvironmentVariables {
  NODE_ENV: string;
  port: number;
  prefix: string;
  api_key: string;
  database: DatabaseType;
  default_user: DefaultUserType;
  jwt: JwtType;
}

export type DatabaseType = {
  user: string;
  password: string;
  uri: string;
};

export type DefaultUserType = {
  name: string;
  role: string;
  email: string;
  password: string;
};

export type JwtType = {
  secret: string;
  expire: string;
};
