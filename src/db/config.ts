export const config = {
    development: {
      client: 'mysql',
      connection: {
        host: 'streaming.nexlesoft.com',
        user: 'test01',
        password: 'PlsDoNotShareThePass123@',
        database: 'entrance_test',
        port: 3307,
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: './migrations' 
      },
      seeds: {
        directory: './seeds'
      }
    }
};
  