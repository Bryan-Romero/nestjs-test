export default () => ({
  config: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    uri: process.env.DATABASE_URI,
  },
  default_user: {
    name: process.env.DEFAULT_USER_NAME,
    email: process.env.DEFAULT_USER_EMAIL,
    password: process.env.DEFAULT_USER_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
  },
});
