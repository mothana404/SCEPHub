import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  Put,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';

@ApiTags('project APIs')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiResponse({
    status: 201,
    description:
      'this is for instructor to create a project and return an success message',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @UseInterceptors(FileInterceptor('file'), UploadInterceptor)
  @Post('instructor/createProject')
  async createNewProject(
    @Req() Request: Request,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const project_img = Request['fileUrl'];
    const instructorID = Request['user'].user_id;
    return await this.projectService.createNewProject(
      createProjectDto,
      project_img,
      instructorID,
    );
  }

  @ApiResponse({
    status: 201,
    description:
      'this is for instructor to update the project and return an success message',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor, Role.Admin)
  @UseInterceptors(FileInterceptor('file'), UploadInterceptor)
  @Put('instructor/update/:id')
  async UpdateProject(
    @Req() Request: Request,
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') projectID: string,
  ) {
    const project_img = Request['fileUrl'];
    return await this.projectService.UpdateProject(
      updateProjectDto,
      project_img,
      projectID,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Get all instructor projects with optional search',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor, Role.Admin)
  @Get('instructorProjects')
  async getInstructorProjects(
    @Req() Request: Request,
    @Query('project_name') projectName?: string,
  ) {
    const instructorID = Request['user'].user_id;
    return await this.projectService.getInstructorProjects(
      instructorID,
      projectName,
    );
  }

  @ApiResponse({
    status: 200,
    description:
      'this is will get all details from project to instructor to students model',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Admin, Role.Instructor)
  @Get('projectDetails/:id')
  async getProjectDetails(@Param('id') projectID: string) {
    return await this.projectService.getProjectDetails(projectID);
  }

  @ApiResponse({
    status: 200,
    description: 'just will return the joined projects for the student',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('student/enrolledProjects')
  async getProjectStudents(@Req() Request: Request) {
    const StudentID = Request['user'].user_id;
    return await this.projectService.getProjectStudents(StudentID);
  }

  @ApiResponse({
    status: 200,
    description: 'return the tasks numbers for every project for the student',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('student/tasksNumber/:project_id')
  async getProjectTasksNumber(
    @Req() Request: Request,
    @Param('project_id') project_id: string,
  ) {
    const StudentID = Request['user'].user_id;
    return await this.projectService.getProjectTasksNumber(
      StudentID,
      project_id,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'get the students request for the instructor',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Get('instructor/studentRequests/:id')
  async getStudentsRequests(
    @Req() Request: Request,
    @Param('id') projectID: string,
  ) {
    return await this.projectService.getStudentsRequests(projectID);
  }

  @ApiResponse({
    status: 200,
    description: 'for the home page view',
  })
  @Get('topProjects')
  async topProjects(@Req() Request: Request) {
    return await this.projectService.topProjects();
  }

  @ApiResponse({ status: 200 })
  @Get('allProjects/:project_name')
  async allProjects(
    @Req() Request: Request,
    @Param('project_name') project_name: string,
  ) {
    return await this.projectService.allProjects(project_name);
  }

  @ApiResponse({ status: 201 })
  @Put('deleteProject/:id')
  async deleteProject(@Req() Request: Request, @Param('id') id: string) {
    return await this.projectService.deleteProject(id);
  }

  @ApiResponse({ status: 201 })
  @Put('acceptStudent/:project_id/:student_id')
  async acceptStudent(
    @Req() Request: Request,
    @Param('project_id') project_id: string,
    @Param('student_id') student_id: string,
    @Body('status') status: any,
  ) {
    return await this.projectService.acceptStudent(
      project_id,
      student_id,
      status,
    );
  }

  @ApiResponse({ status: 201 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('projectRequest/:project_id')
  async makeRequestToProject(
    @Req() Request: Request,
    @Param('project_id') project_id: string,
  ) {
    const studentID = Request['user'].user_id;
    return await this.projectService.makeRequestToProject(
      project_id,
      studentID,
    );
  }

  @ApiResponse({ status: 200, description: 'Get all instructor projects' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor, Role.Admin)
  @Get('instructorWorkSpace')
  async getInstructorWorkSpace(@Req() Request: Request) {
    const instructorID = Request['user'].user_id;
    return await this.projectService.getInstructorWorkSpace(instructorID);
  }

  @ApiResponse({
    status: 200,
    description: 'Get all instructor tasks for his project',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor, Role.Admin)
  @Get('instructor/allTasks/:project_id')
  async getInstructorWorkSpaceTasks(
    @Req() request: Request,
    @Param('project_id') project_id: string,
    @Query('task_name') task_name?: string,
    @Query('status') status?: string,
  ) {
    return await this.projectService.getInstructorWorkSpaceTasks(
      project_id,
      status,
      task_name,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'This is for the projects table in the admin dashboard',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin/projectsData')
  async projectsForAdmin(
    @Query('search') search: string = '',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 7,
  ) {
    return await this.projectService.projectsForAdmin(search, page, limit);
  }

  @ApiResponse({
    status: 200,
    description: 'return the all the joined students in the project',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor, Role.Admin)
  @Get('projectJoinedStudents/:project_id')
  async getAllJoinedStudents(
    @Req() Request: Request,
    @Param('project_id') project_id: string,
  ) {
    return await this.projectService.getAllJoinedStudents(project_id);
  }

  @ApiResponse({
    status: 200,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Get('viewProjectsStatistics/:project_id')
  async viewProjectsStatistics(
    @Req() Request: Request,
    @Param('project_id') project_id: string,
  ) {
    const instructorID = Request['user'].user_id;
    return await this.projectService.viewProjectsStatistics(
      instructorID,
      project_id,
    );
  }

  @ApiResponse({
    status: 200,
  })
  @Get('homeProjectDetails/:project_id')
  async homeProjectDetails(
    @Req() Request: Request,
    @Param('project_id') project_id: string,
  ) {
    return await this.projectService.homeProjectDetails(project_id);
  }
}
