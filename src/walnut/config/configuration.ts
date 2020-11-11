export default () => ({
  server: {
    APIPrefix: process.env.SERVER_API_PREFIX,
    port: parseInt(process.env.SERVER_PORT),
  },

  db: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    name: process.env.DATABASE_NAME,

    source: process.env.DATABASE_SOURCE,
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASS,
  },

  jwt: {
    serct: process.env.JWT_SERECT,
    expire: parseInt(process.env.JWT_EXPIRE),
  },
});
