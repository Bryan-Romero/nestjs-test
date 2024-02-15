export const configuration = () => ({
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  prefix: process.env.PREFIX,
  api_key: process.env.API_KEY,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    secret_refresh: process.env.JWT_SECRET_REFRESH,
    expires_in_refresh: process.env.JWT_EXPIRES_IN_REFRESH,
  },
  database: {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    uri: process.env.DATABASE_URI,
  },
  default_user: {
    username: process.env.DEFAULT_USER_NAME,
    role: process.env.DEFAULT_USER_ROLE,
    email: process.env.DEFAULT_USER_EMAIL,
    password: process.env.DEFAULT_USER_PASSWORD,
  },
});

// https://dev.to/pitops/managing-multiple-environments-in-nestjs-71l
