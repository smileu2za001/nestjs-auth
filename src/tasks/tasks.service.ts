import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum'
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) { }

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]>{
        return this.taskRepository.getTask(filterDto);
    }

    async getTaskByID(ID: number): Promise<Task> {
        const found = await this.taskRepository.findOne(ID);
        if (!found) {
            console.log("Error " + ID + " not found");
            throw new NotFoundException('Task with ID ' + ID + ' not found');
        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }


    async deleteTaskByID(ID: number): Promise<void> {
        const result = await this.taskRepository.delete(ID);
        console.log(result);

        if (result.affected === 0) {
            throw new NotFoundException('Task with ID ' + ID + ' not found');
        }
        /* Remove : Entiry || Delete : ID */
        // const para1 = await this.taskRepository.findOne(ID)
        // const para2 = await this.taskRepository.remove(para1);
        // console.log(para2);
    }

    async updateTaskStatus(ID: number, STATUS: TaskStatus): Promise<Task>{
        const task = await this.getTaskByID(ID);
        task.status = STATUS;
        
        await task.save();
        return task;
    }

}
