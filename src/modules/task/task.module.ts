import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskRepository } from './repositories/task.repository';
import { JwtGuard } from 'src/common/gaurd/auth.gaurd';
import { Amqplibi } from 'src/common/services/rmq.service';

@Module({
  providers: [TaskService, TaskRepository, JwtGuard, Amqplibi],
  controllers: [TaskController],
})
export class TaskModule {}
