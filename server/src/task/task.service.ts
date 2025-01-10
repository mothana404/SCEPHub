import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Projects } from 'src/database/entities/project.entity';
import { Users } from 'src/database/entities/user.entity';
import { Students } from 'src/database/entities/student.entity';
import { Instructors } from 'src/database/entities/instructor.entity';
import { ProjectParticipants } from 'src/database/entities/Project-Participants.entity';
import { Tasks } from 'src/database/entities/project-task.entity';
import { Sequelize } from 'sequelize';
import { UpdateTaskDto } from './dto/update-task.dto';
import { title } from 'process';
import { CreateTaskDto } from './dto/create-task.dto';
import sequelize from 'sequelize';

@Injectable()
export class TaskService {
  constructor(
    @Inject('PROJECTS_REPOSITORY')
    private readonly ProjectModel: typeof Projects,
    @Inject('USER_REPOSITORY') private readonly UserModel: typeof Users,
    @Inject('STUDENT_REPOSITORY')
    private readonly StudentModel: typeof Students,
    @Inject('INSTRUCTOR_REPOSITORY')
    private readonly InstructorModel: typeof Instructors,
    @Inject('PROJECTPARTICIPANTS')
    private readonly participantsModel: typeof ProjectParticipants,
    @Inject('TASKS')
    private readonly tasksModel: typeof Tasks,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async addTaskToStudent(
    TaskDto: CreateTaskDto,
    project_id: string,
    student_id: string,
    task_img: string,
  ) {
    try {
      const project = await this.ProjectModel.findOne({
        where: { project_id: project_id },
      });
      if (!project) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      const student = await this.StudentModel.findOne({
        where: { user_id: student_id },
      });
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      const newTask = await this.tasksModel.create({
        project_id: project_id,
        assigned_to: student_id,
        title: TaskDto.title,
        description: TaskDto.description,
        due_date: TaskDto.due_date,
        task_img: task_img,
      });
      return {
        message: 'Task created successfully!',
        task: newTask,
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTask(
    updateTaskDto: UpdateTaskDto,
    task_id: string,
    task_img: string,
    student_id: string,
  ) {
    try {
      const updatedTask = await this.tasksModel.findByPk(task_id);
      await this.tasksModel.update(
        {
          title: updateTaskDto.title || updatedTask.title,
          description: updateTaskDto.description || updatedTask.description,
          due_date: updateTaskDto.due_date || updatedTask.due_date,
          task_img: task_img || updatedTask.task_img,
          assigned_to: student_id || updatedTask.assigned_to,
        },
        {
          where: {
            task_id: task_id,
          },
        },
      );
      return { status: 200 };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTask(task_id: string) {
    try {
      const task = await this.tasksModel.findByPk(task_id);
      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      await task.destroy();
      return { message: 'Task deleted successfully!' };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTaskDetails(task_id: string) {
    try {
      const taskDetails = await this.tasksModel.findOne({
        where: {
          task_id: task_id,
        },
      });
      return taskDetails;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStudentTasks(studentID: string) {
    try {
      const studentTasks = await this.tasksModel.findAll({
        where: {
          assigned_to: studentID,
        },
      });
      return studentTasks;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async taskDelivery(task_id: string, task_link: string) {
    try {
      const task = await this.tasksModel.findByPk(task_id);
      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      await task.update({
        task_delivery: task_link,
        status: 'pending_approval',
      });
      console.log(`Task ${task_id} successfully updated to 'completed'.`);
      return task;
    } catch (error) {
      console.error('Error during task update:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async returnTask(task_id: string, status: string) {
    try {
      if (['in_progress', 'completed', 'pending_approval'].includes(status)) {
        await this.tasksModel.update(
          {
            status: status,
          },
          {
            where: {
              task_id: task_id,
            },
          },
        );
        return { message: 'Task returned!' };
      } else {
        return { message: 'Not Acceptable Status!' };
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllStudentTasksPagination(
    StudentID: string,
    project_id: string,
    page: number,
    limit: number,
    search: string,
    status: string,
  ) {
    try {
      const pageNumber = page < 1 ? 1 : page;
      const limitNumber = limit < 1 ? 10 : parseInt(limit.toString(), 10);
      const skip = (pageNumber - 1) * limitNumber;
      const studentAccount = await this.StudentModel.findOne({
        where: { user_id: StudentID },
      });
      if (!studentAccount) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      const whereConditions: any = {
        project_id: project_id,
        assigned_to: studentAccount.user_id,
      };
      if (search) {
        whereConditions[sequelize.Op.or] = [
          { title: { [sequelize.Op.like]: `%${search}%` } },
        ];
      }
      //   if (status) {
      //     whereConditions.status = status;
      //   }
      const { rows: tasks, count: total } =
        await this.tasksModel.findAndCountAll({
          where: whereConditions,
          offset: skip,
          limit: limitNumber,
        });
      const totalPages = Math.ceil(total / limitNumber);
      const meta = {
        totalItems: total,
        totalPages: totalPages,
        currentPage: pageNumber,
      };
      return { tasks, meta, StudentID };
    } catch (error) {
      console.error('Error fetching student tasks:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
