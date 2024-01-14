import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { CitizenModule } from './citizen/citizen.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AdminModule,
    CitizenModule,
    DatabaseModule,
    TypeOrmModule.forRoot({
      // type: 'mysql',
      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: '',
      // database: 'thesis_db',
      // autoLoadEntities: true,
      // synchronize: true,

      //cloud server database credentials
      type: 'mysql',
      host: 'boyqaghsjv9htjkn3hur-mysql.services.clever-cloud.com',
      port: 3306,
      username: 'uuxldlt68laya99e',
      password: 'XRoaW5uUOsdoV6bRSje3',
      database: 'boyqaghsjv9htjkn3hur',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
