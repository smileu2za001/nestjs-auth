"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const tasks_repository_1 = require("./tasks.repository");
const typeorm_1 = require("@nestjs/typeorm");
let TasksService = class TasksService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async getTasks(filterDto) {
        return this.taskRepository.getTask(filterDto);
    }
    async getTaskByID(ID) {
        const found = await this.taskRepository.findOne(ID);
        if (!found) {
            console.log("Error " + ID + " not found");
            throw new common_1.NotFoundException('Task with ID ' + ID + ' not found');
        }
        return found;
    }
    async createTask(createTaskDto) {
        return this.taskRepository.createTask(createTaskDto);
    }
    async deleteTaskByID(ID) {
        const result = await this.taskRepository.delete(ID);
        console.log(result);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Task with ID ' + ID + ' not found');
        }
    }
    async updateTaskStatus(ID, STATUS) {
        const task = await this.getTaskByID(ID);
        task.status = STATUS;
        await task.save();
        return task;
    }
};
TasksService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(tasks_repository_1.TaskRepository)),
    __metadata("design:paramtypes", [tasks_repository_1.TaskRepository])
], TasksService);
exports.TasksService = TasksService;
//# sourceMappingURL=tasks.service.js.map