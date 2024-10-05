import { Injectable } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(createTaskDto: CreateTaskDto) {
    return this.taskRepository.createTask(createTaskDto);
  }

  async getTaskById(id: number) {
    return this.taskRepository.getTaskById(id);
  }

  async getAllTasksByUUID(uuid: string) {
    return this.taskRepository.getAllTasksByUUID(uuid);
  }
}
