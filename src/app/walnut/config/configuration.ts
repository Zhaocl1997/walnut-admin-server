export default () => ({
  port: parseInt(process.env.PORT),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
  },
});
