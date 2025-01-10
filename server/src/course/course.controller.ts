import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  Req,
  HttpException,
  HttpStatus,
  Query,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@ApiTags('Course APIs')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiResponse({
    status: 200,
    description:
      'Get all courses for all roles with search and category filtering',
  })
  @UseGuards(AuthGuard)
  @Get('allCourses')
  async getAllCourses(
    @Query('course_name') search?: string,
    @Query(
      'categories',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    categories?: string[],
  ) {
    const allCourses = await this.courseService.getAllCourses(
      search,
      categories,
    );
    return allCourses;
  }

  @ApiResponse({
    status: 200,
    description: 'Get the course content based on the subscription',
  })
  @UseGuards(AuthGuard)
  @Get('courseDetails/:id')
  async getCourseDetails(
    @Param('id') course_id: string,
    @Req() Request: Request,
  ) {
    const studentID = Request['user'].user_id;
    const role = Request['user'].role;
    const allCourses = await this.courseService.getCourseDetails(
      course_id,
      studentID,
      role,
    );
    return allCourses;
  }

  @ApiResponse({ status: 201, description: 'created successfully!' })
  @ApiResponse({ status: 403, description: 'Invalid data provided' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @UseInterceptors(FileInterceptor('file'), UploadInterceptor)
  @Post()
  async createNewCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Req() Request: Request,
  ) {
    try {
      const course_img = Request['fileUrl'];
      const instructorID = Request['user'].user_id;
      const result = await this.courseService.createNewCourse(
        createCourseDto,
        course_img,
        instructorID,
      );
      return {
        status: 'success',
        message: 'Course created successfully!',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Get the instructor courses that he created',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Get('instructorCourses')
  findAllInstructorCourses(
    @Req() Request: Request,
    @Query('course_name') courseName?: string,
  ) {
    const instructorID = Request['user'].user_id;
    return this.courseService.findAllInstructorCourses(
      instructorID,
      courseName,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'this is make the course active and seen by all members',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor, Role.Admin)
  @Put('activateCourse/:id')
  activateCourse(@Req() Request: Request, @Param('id') courseID?: string) {
    return this.courseService.activateCourse(courseID);
  }

  @ApiResponse({ status: 201 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @UseInterceptors(FileInterceptor('file'), UploadInterceptor)
  @Put('update/:id')
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() Request: Request,
  ) {
    const course_img = Request['fileUrl'];
    return this.courseService.updateCourse(id, updateCourseDto, course_img);
  }

  @ApiResponse({
    status: 201,
    description: 'It just return that the course is deleted!',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor, Role.Admin)
  @Put('delete/:id')
  removeCourse(@Param('id') id: string) {
    return this.courseService.removeCourse(id);
  }

  @ApiResponse({
    status: 201,
    description: 'this will take some time! to upload the content',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @UseInterceptors(FileInterceptor('file'), UploadInterceptor)
  @Post('content/:id')
  async createCourseContent(
    @Req() Request: Request,
    @Body() createContentDto: CreateContentDto,
    @Param('id', ParseIntPipe) courseID: bigint,
  ) {
    const course_vid = await Request['fileUrl'];
    return this.courseService.createCourseContent(
      createContentDto,
      courseID,
      course_vid,
    );
  }

  @ApiResponse({ status: 201 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @UseInterceptors(FileInterceptor('file'), UploadInterceptor)
  @Put('content/:courseID/:contentID')
  async updateOnContent(
    @Req() Request: Request,
    @Body() updateContentDto: UpdateContentDto,
    @Param('courseID', ParseIntPipe) courseID: bigint,
    @Param('contentID', ParseIntPipe) contentID: bigint,
  ) {
    const course_vid = await Request['fileUrl'];
    return this.courseService.updateOnContent(
      updateContentDto,
      courseID,
      contentID,
      course_vid,
    );
  }

  @ApiResponse({ status: 201 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @UseInterceptors(FileInterceptor('file'), UploadInterceptor)
  @Put('deleteContent/:courseID/:contentID')
  async deleteContent(
    @Param('courseID', ParseIntPipe) courseID: bigint,
    @Param('contentID', ParseIntPipe) contentID: bigint,
  ) {
    return this.courseService.deleteContent(courseID, contentID);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('getUnSubCourses')
  async getUnSubCourses(@Req() Request: Request) {
    const StudentID = Request['user'].user_id;
    return this.courseService.getUnSubCourses(StudentID);
  }

  @ApiResponse({
    status: 201,
    description: 'This api for add and delete course from the list',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('enrollment/:id')
  async addToMyCourseList(
    @Req() Request: Request,
    @Param('id', ParseIntPipe) courseID: bigint,
  ) {
    const studentID = Request['user'].user_id;
    return this.courseService.addToMyCourseList(courseID, studentID);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('enrollmentCourses')
  async getMyCourseList(@Req() Request: Request) {
    const studentID = Request['user'].user_id;
    return this.courseService.getMyCourseList(studentID);
  }

  @ApiResponse({
    status: 201,
    description:
      'you need to have a subscription and to save the course in your list',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('rate/:id')
  async addRate(
    @Req() Request: Request,
    @Param('id', ParseIntPipe) CourseID: bigint,
    @Body('rating') rating: number,
  ) {
    const student = Request['user'];
    return this.courseService.addRate(
      student.user_id,
      CourseID,
      student.role,
      rating,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'for top courses in home page',
  })
  @Get('topRatingCourses')
  async topCoursesRate(@Req() Request: Request) {
    return this.courseService.topCoursesRate();
  }

  @ApiResponse({
    status: 200,
    description: 'for top courses in home page',
  })
  @Get('coursePage/:id')
  async coursePage(@Req() Request: Request, @Param('id') id: string) {
    return await this.courseService.coursePage(id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Instructor, Role.Admin)
  @Get('getCourseContent/:id')
  async getCourseContent(@Req() Request: Request) {
    const StudentID = Request['user'].user_id;
    return this.courseService.getUnSubCourses(StudentID);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor, Role.Admin)
  @Get('CourseViewStatistics/:id')
  async getCourseViewStatistics(
    @Req() Request: Request,
    @Param('id') courseID: string,
  ) {
    const instructorID = Request['user'].user_id;
    return this.courseService.getCourseViewStatistics(instructorID, courseID);
  }

  @ApiResponse({
    status: 200,
    description: 'Get all courses for all roles with search and pagination',
  })
  @UseGuards(AuthGuard)
  @Get('allCoursesForAdmin')
  async getAllCoursesForAdmin(@Query('course_name') search?: string) {
    const allCourses = await this.courseService.getAllCoursesFormAdmin(search);
    return allCourses;
  }
}
