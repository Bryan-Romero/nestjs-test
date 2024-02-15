export interface ConfigurationType {
  node_env: string;
  port: number;
  prefix: string;
  api_key: string;
  database: DatabaseType;
  default_user: DefaultUserType;
  jwt: JwtType;
}

export interface DatabaseType {
  user: string;
  password: string;
  uri: string;
}

export interface DefaultUserType {
  username: string;
  role: string;
  email: string;
  password: string;
}

export interface JwtType {
  secret: string;
  expires_in: string;
  secret_refresh: string;
  expires_in_refresh: string;
}
