import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'bookmark-db-1.caolxqclmgpa.us-east-1.rds.amazonaws.com:',
        port: 5432,
        username: 'postgres',
        password: 'Goodmode_en',
        database: 'postgres',
      });
      sequelize.addModels([]);
      await sequelize.sync();
      return sequelize;
    },
  },
];