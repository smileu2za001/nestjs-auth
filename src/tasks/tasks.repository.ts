import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum"
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    async getTask(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const STATUS = filterDto.status;
        const SEARCH = filterDto.search;

        const query = this.createQueryBuilder('task');
        if (STATUS) {
            query.andWhere('task.status = :STATUS', { STATUS });
        }
        if (SEARCH) {
            query.andWhere('(task.title LIKE :sch OR task.description LIKE :sch)', { sch: `%${SEARCH}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }


    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const TITLE = createTaskDto.title;
        const DESCRIPTION = createTaskDto.description;

        const task = new Task();
        task.title = TITLE;
        task.description = DESCRIPTION;
        task.status = TaskStatus.OPEN;

        await task.save();
        return task;
    }
}
