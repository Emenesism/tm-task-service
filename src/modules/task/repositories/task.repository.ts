import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskRepositoryResponse } from '../interfaces/userRepoResponse';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(
    createTaskDto: CreateTaskDto,
  ): Promise<TaskRepositoryResponse> {
    try {
      const task = await this.save(createTaskDto);

      if (!task) {
        return {
          success: false,
          message: "Can't create the Task",
        };
      }

      return {
        success: true,
        message: 'Task created successfully',
        data: task,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getTaskById(id: number): Promise<TaskRepositoryResponse> {
    try {
      const task = await this.findOne({ where: { id } });

      if (!task) {
        return {
          success: false,
          message: 'Task not found',
        };
      }

      return {
        success: true,
        message: 'Task found',
        data: task,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get all tasks by UUID
   */
  async getAllTasksByUUID(uuid: string): Promise<TaskRepositoryResponse> {
    try {
      const tasks = await this.find({ where: { uuid } });

      if (!tasks.length) {
        return {
          success: false,
          message: 'No tasks found for the given UUID',
        };
      }

      return {
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
