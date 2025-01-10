import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Req,
  Put,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Tasks APIs')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 404, description: 'Project or Student not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseInterceptors(FileInterceptor('file'), UploadInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Post('addTask/:project_id/:student_id')
  async addTaskToStudent(
    @Body() createTaskDto: CreateTaskDto,
    @Param('project_id') project_id: string,
    @Param('student_id') student_id: string,
    @Req() Request: Request,
  ) {
    const task_img = Request['fileUrl'];
    return await this.taskService.addTaskToStudent(
      createTaskDto,
      project_id,
      student_id,
      task_img,
    );
  }

  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request. data is invalid.' })
  @ApiResponse({ status: 404, description: 'Task or Student not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @UseInterceptors(FileInterceptor('file'), UploadInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Put('updateTask/:task_id/:student_id')
  async updateTask(
    @Req() Request: Request,
    @Param('task_id') task_id: string,
    @Param('student_id') student_id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    try {
      const task_image = Request['fileUrl'];
      return await this.taskService.updateTask(
        updateTaskDto,
        task_id,
        task_image,
        student_id,
      );
    } catch (error) {
      console.log(error);
    }
  }

  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 500 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Delete('deleteTask/:task_id')
  async deleteTask(@Req() Request: Request, @Param('task_id') task_id: string) {
    return await this.taskService.deleteTask(task_id);
  }

  @ApiResponse({ status: 201 })
  @Get('taskDetails/:task_id')
  async getTaskDetails(
    @Req() Request: Request,
    @Param('task_id') task_id: string,
  ) {
    return await this.taskService.getTaskDetails(task_id);
  }

  @ApiResponse({ status: 201 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('student/myTasks')
  async getStudentTasks(@Req() Request: Request) {
    const StudentID = Request['user'].user_id;
    return await this.taskService.getStudentTasks(StudentID);
  }

  @ApiResponse({ status: 201 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('student/taskDelivery/:task_id')
  async taskDelivery(
    @Req() Request: Request,
    @Param('task_id') task_id: string,
    @Body('task_link') task_link: string,
  ) {
    if (!task_link) {
      throw new HttpException('task link is required', HttpStatus.BAD_REQUEST);
    }
    console.log(task_link);
    const StudentID = Request['user'].user_id;
    return await this.taskService.taskDelivery(task_id, task_link);
  }

  @ApiResponse({ status: 201 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Put('instructor/returnTask/:task_id')
  async returnTask(
    @Req() Request: Request,
    @Body('status') status: string,
    @Param('task_id') task_id: string,
  ) {
    return await this.taskService.returnTask(task_id, status);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('student/tasksForStudentProject/:project_id')
  async getAllStudentTasksPagination(
    @Req() request: Request,
    @Param('project_id') project_id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 6,
    @Query('status') status: string = 'in_progress',
  ) {
    const StudentID = request['user'].user_id;
    const search = request['query']?.searchQuery || '';
    return await this.taskService.getAllStudentTasksPagination(
      StudentID,
      project_id,
      page,
      limit,
      search,
      status,
    );
  }
}
