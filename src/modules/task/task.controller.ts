import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepositoryResponse } from './interfaces/userRepoResponse';
import { Controller, Post, Get, Param, Query, Body } from '@nestjs/common';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskRepositoryResponse> {
    return this.taskService.createTask(createTaskDto);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<TaskRepositoryResponse> {
    return this.taskService.getTaskById(Number(id));
  }

  @Get()
  async getAllTasksByUUID(
    @Query('uuid') uuid: string,
  ): Promise<TaskRepositoryResponse> {
    return this.taskService.getAllTasksByUUID(uuid);
  }
}
