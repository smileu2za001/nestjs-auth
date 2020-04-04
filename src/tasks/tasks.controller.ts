import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto) {
        return this.tasksService.getTasks(filterDto);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) ID: number): Promise<Task> {
        console.log("Search is " + ID);
        return this.tasksService.getTaskByID(ID);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTaskByID(@Param('id', ParseIntPipe) ID: number): Promise<void> {
        console.log(ID + " to Delete Process (Controller)");
        return this.tasksService.deleteTaskByID(ID);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) ID: number,
        @Body('status', TaskStatusValidationPipe) STATUS: TaskStatus
    ): Promise<Task> {
        console.log(ID + " to Update Status")
        return this.tasksService.updateTaskStatus(ID, STATUS);
    }





}
/* ===== USE PIPE =====
GLOBAL PIPE
    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() CreateTaskDto: CreateTaskDto): Task {
PARAM PIPE
    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[]{
MANUAL PIPE
    @Patch('/:id/status')
    updateTaskStatus(@Body('status', TaskStatusValidationPipe) STATUS: TaskStatus ): Task {
        #look on pipes/folders
*/


/* ===== FUNCTION AND RETURN TYPE =====
FUNCTION
    @METHOD('PATH')
    function_on_service(Parameter => variable:type) : return type{
        return this.service.function_on_service(Param);
    }
EXAMPLE
    @Get('/:id')
    getTaskById(@Param('id') as:string) : Task{
       return this.tasksService.getTaskByID(as);
    }
*/


/* ===== POSTMAN POST METHOD =====
POSTMAN > Body
    KEY             VALUE
    title           Text of title
    descrtiption    Text of Description

Codeing
    @Post()
    createTask(@Body('title') temp){
        console.log('body is ',temp);
        // body is Text of title
    }

    @Post()
    createTask(@Body() temp){
        console.log('body is ',temp);
        // body is { title: 'Text of Title', description: 'Text of Description' }
    }
*/


/*  ===== ID PARAMETER =====
LINK
    localhost:3000/AllahuAbkar
Result
    as = AllahuAkbar
Coding
    getTaskById(@Param('id') as:string): Task{
        console.log(as)
   }
*/

/* ====== ID QUERY =======
DTO FILE
    export class GetTaskFilterDto{
        status : TaskStatus;
        search : string;
    }
LINK
    localhost:3000/status=open&search=akbar
RESULT
    status = 'open' , search = 'akbar';
Coding
    getAllTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
        console.log(filterDto);
}
*/