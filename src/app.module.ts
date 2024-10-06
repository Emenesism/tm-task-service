import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './modules/task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './modules/task/entities/task.entity';
import globallConfig from './configs/global.config';

@Module({
  imports: [
    TaskModule,
    TypeOrmModule.forRoot({
      type: globallConfig.db.dialect as
        | 'mysql'
        | 'postgres'
        | 'mariadb'
        | 'sqlite'
        | 'mongodb',
      host: globallConfig.db.host,
      port: +globallConfig.db.port,
      username: globallConfig.db.user,
      password: globallConfig.db.pass,
      database: globallConfig.db.name,
      synchronize: true,
      entities: [Task],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
