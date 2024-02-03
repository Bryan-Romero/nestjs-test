export interface EnvironmentVariables {
  config: ConfigType;
  database: DatabaseType;
  default_user: DefaultUserType;
  jwt: JwtType;
}

export type ConfigType = {
  port: number;
};

export type DatabaseType = {
  user: string;
  password: string;
  uri: string;
};

export type DefaultUserType = {
  name: string;
  email: string;
  password: string;
};

export type JwtType = {
  secret: string;
  expire: string;
};
