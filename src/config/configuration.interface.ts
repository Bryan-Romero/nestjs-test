import { Role } from 'src/common/enums';

export interface ConfigurationType {
  node_env: string;
  port: number;
  prefix: string;
  api_key: string;
  database: DatabaseType;
  default_user: DefaultUserType;
  jwt: JwtType;
  mail: MailType;
  bcryptjs_salt_rounds: number;
}

export interface DatabaseType {
  uri: string;
}

export interface DefaultUserType {
  username: string;
  role: Role;
  email: string;
  password: string;
}

export interface JwtType {
  secret: string;
  expires_in: string;
  secret_refresh: string;
  expires_in_refresh: string;
}

export interface MailType {
  host: string;
  user: string;
  password: string;
  from: string;
  port?: number;
}
