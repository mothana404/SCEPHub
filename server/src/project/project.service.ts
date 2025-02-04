import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Instructors } from 'src/database/entities/instructor.entity';
import { Students } from 'src/database/entities/student.entity';
import { Users } from 'src/database/entities/user.entity';
import { col, fn, Sequelize, where } from 'sequelize';
import { Projects } from 'src/database/entities/project.entity';
import { ProjectParticipants } from 'src/database/entities/Project-Participants.entity';
import { Op } from 'sequelize';
import { Categories } from 'src/database/entities/category.entity';
import { Groups } from 'src/database/entities/groups.entity';
import { stringify } from 'querystring';
import { Tasks } from 'src/database/entities/project-task.entity';
import { UserGroups } from 'src/database/entities/user-groups.entity';
import { Skills } from 'src/database/entities/skills.entity';

@Injectable()
export class ProjectService {
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
    @Inject('GROUPS')
    private readonly groupsModel: typeof Groups,
    @Inject('USERGROUPS')
    private readonly userGroups: typeof UserGroups,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async createNewProject(
    createProjectDto: CreateProjectDto,
    project_img: string,
    instructorID: string,
  ) {
    try {
      const InstructorIDFromInstructorModel =
        await this.InstructorModel.findOne({
          where: {
            instructor_id: instructorID,
          },
        });
      const projectName = await this.ProjectModel.findOne({
        where: { project_name: createProjectDto.project_name },
      });
      if (projectName) {
        return 'The project name is already exist!';
      }
      if (typeof createProjectDto.required_skills === 'string') {
        createProjectDto.required_skills = JSON.parse(
          createProjectDto.required_skills,
        );
      }
      const newProject = await this.ProjectModel.create({
        project_name: createProjectDto.project_name,
        project_description: createProjectDto.project_description,
        project_img: project_img,
        project_instructor: InstructorIDFromInstructorModel.id,
        project_category: createProjectDto.project_category,
        start_date: createProjectDto.start_date || null,
        end_date: createProjectDto.end_date,
        required_skills: createProjectDto.required_skills,
      });
      const ProjectGroup = await this.groupsModel.create({
        group_name: createProjectDto.project_name,
        group_project: newProject.project_id,
      });
      await this.UserModel.update(
        {
          group_id: ProjectGroup.group_id,
          chat_groups: Sequelize.fn(
            'JSON_ARRAY_APPEND',
            Sequelize.col('chat_groups'),
            '$',
            ProjectGroup.group_id,
          ),
        },
        {
          where: {
            user_id: instructorID,
          },
        },
      );
      await this.groupsModel.create({
        group_name: createProjectDto.project_name,
        group_project: ProjectGroup.group_id,
      });
      return { message: 'project Created Successfully!' };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async UpdateProject(
    updateProjectDto: UpdateProjectDto,
    project_img: string,
    projectID: string,
  ) {
    try {
      const project = await this.ProjectModel.findByPk(projectID);
      if (!project) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      if (typeof updateProjectDto.required_skills === 'string') {
        updateProjectDto.required_skills = JSON.parse(
          updateProjectDto.required_skills,
        );
      }
      await this.ProjectModel.update(
        {
          project_name: updateProjectDto.project_name || project.project_name,
          project_description:
            updateProjectDto.project_description || project.project_description,
          project_img: project_img || project.project_img,
          project_category:
            updateProjectDto.project_category || project.project_category,
          start_date: updateProjectDto.start_date || project.start_date,
          end_date: updateProjectDto.end_date || project.end_date,
          required_skills:
            updateProjectDto.required_skills || project.required_skills,
        },
        {
          where: { project_id: projectID },
        },
      );
      return { message: 'Project updated successfully!' };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getInstructorProjects(instructorID: string, projectName?: string) {
    try {
      const instructorIDFromInstructorModel =
        await this.InstructorModel.findOne({
          where: {
            instructor_id: instructorID,
          },
        });
      const query = {
        where: {
          project_instructor: instructorIDFromInstructorModel.id,
          is_deleted: false,
          ...(projectName && {
            project_name: {
              [Op.like]: `%${projectName}%`,
            },
          }),
        },
        include: [
          {
            model: Categories,
            as: 'category',
          },
        ],
      };
      const projects = await this.ProjectModel.findAll(query);
      return projects;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProjectStudents(StudentID: string) {
    try {
      console.log(StudentID);
      const userAccount = await this.StudentModel.findByPk(StudentID);
      let projectsID: any;
      projectsID = await this.participantsModel.findAll({
        where: {
          student_id: userAccount.dataValues.user_id,
          accepted: 2,
        },
      });
      if (!projectsID || projectsID.length === 0) {
        return [];
      }
      const projectIds = projectsID.map(
        (participant: any) => participant.project_id,
      );
      const studentProjects = await this.ProjectModel.findAll({
        where: {
          project_id: projectIds,
        },
        include: [
          {
            model: Instructors,
            as: 'instructor',
            include: [
              {
                model: Users,
                as: 'user',
              },
            ],
          },
          {
            model: Categories,
            as: 'category',
          },
          {
            model: Tasks,
          },
        ],
      });
      return studentProjects;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProjectDetails(projectID: string) {
    try {
      const projectDetails = await this.ProjectModel.findOne({
        where: {
          project_id: projectID,
        },
        include: [
          {
            model: Instructors,
            include: [
              {
                model: Users,
                as: 'user',
              },
            ],
            as: 'instructor',
          },
          {
            model: Categories,
            as: 'category',
          },
          {
            model: ProjectParticipants,
            as: 'participants', 
            where: { accepted: 2 }, 
            required: false,
            include: [
              {
                model: Students,
                include: [
                  {
                    model: Users,
                    as: 'user', 
                  },
                ],
                as: 'student', 
              },
            ],
          },
        ],
      });
      if (!projectDetails) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }

      const participants = projectDetails.participants.map(
        (participant) => participant.student,
      );

      return { projectDetails, participants };
    } catch (error) {
      console.log('Error in getProjectDetails:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getStudentsRequests(projectID: string) {
    try {
      const pendingRequests = await this.participantsModel.findAll({
        where: {
          project_id: projectID,
          accepted: 1, 
        },
        include: [
          {
            model: Students,
            as: 'student', 
            include: [
              {
                model: Users,
                as: 'user', 
              },
              {
                model: Skills,
                as: 'skills', 
              },
            ],
          },
        ],
      });

      if (!pendingRequests || pendingRequests.length === 0) {
        return { message: 'No pending requests for this project.' };
      }

      const studentsProfiles = pendingRequests.map(
        (request) => request.student,
      );

      return studentsProfiles;
    } catch (error) {
      console.error('Error fetching student requests:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async topProjects() {
    try {
      const topProjects = await this.ProjectModel.findAll({
        where: {
          is_deleted: false,
          active: true,
        },
        limit: 6,
        include: {
          model: ProjectParticipants,
          as: 'participants',
        },
      });
      return topProjects;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async allProjects(name?: string) {
    try {
      const whereClause: any = {
        is_deleted: false,
      };
      if (name) {
        whereClause.project_name = { [Op.iLike]: `%${name}%` };
      }
      const allProjects = await this.ProjectModel.findAll({
        // where: whereClause,
        include: [
          {
            model: Instructors,
            include: [
              {
                model: Users,
              },
            ],
          },
          {
            model: Categories,
          },
          {
            model: ProjectParticipants,
          },
        ],
      });
      return allProjects;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProject(project_id: string) {
    try {
      const deletedProject = await this.ProjectModel.findByPk(project_id);
      if (deletedProject.is_deleted === false) {
        await deletedProject.update({ is_deleted: true });
        return { message: 'Project deleted successfully' };
      } else {
        await deletedProject.update({ is_deleted: false });
        return { message: 'Project returned successfully' };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async acceptStudent(project_id: string, student_id: string, status: any) {
    try {
      const projectParticipant = await this.participantsModel.findOne({
        where: {
          project_id: project_id,
          student_id: student_id,
        },
      });
      if (!projectParticipant) {
        return { message: 'The request is not found!' };
      }
      const student = await this.StudentModel.findByPk(student_id);
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      const newStatus = status;
      await projectParticipant.update({ accepted: newStatus });

      if (status) {
        const group = await this.groupsModel.findOne({
          where: { group_project: project_id },
        });
        if (!group) {
          throw new HttpException(
            'Group not found for the project',
            HttpStatus.NOT_FOUND,
          );
        }
        await this.userGroups.create({
          user_id: student_id,
          group_id: group.group_id,
        });
        return { message: 'Student accepted successfully!' };
      } else {
        return { message: 'Student rejected successfully!' };
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async makeRequestToProject(project_id: string, studentID: string) {
    try {
      const student = await this.StudentModel.findByPk(studentID);
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      const projectParticipant = await this.participantsModel.findOne({
        where: { project_id: project_id, student_id: student.user_id },
      });
      if (projectParticipant) {
        return { message: 'you have already make a request to this project!' };
      } else {
        await this.participantsModel.create({
          project_id: project_id,
          student_id: student.user_id,
        });
        return {
          message: 'Request to join the project has been sent successfully!',
        };
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getInstructorWorkSpace(instructorID: string) {
    try {
      const instructor = await this.InstructorModel.findOne({
        where: {
          instructor_id: instructorID,
        },
      });
      if (!instructor) {
        throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
      }
      const projects = await this.ProjectModel.findAll({
        where: {
          project_instructor: instructor.id,
          is_deleted: false,
        },
        include: [
          {
            model: Categories,
            as: 'category',
          },
        ],
      });
      if (!projects.length) {
        return [];
      }
      const projectIds = projects.map((project) => project.project_id);
      const participants = await this.participantsModel.findAll({
        where: {
          project_id: projectIds,
          accepted: 2,
        },
        attributes: [
          'project_id',
          [
            Sequelize.fn('COUNT', Sequelize.col('project_id')),
            'participantCount',
          ],
        ],
        group: ['project_id'],
      });
      const tasks = await this.tasksModel.findAll({
        where: {
          project_id: projectIds,
        },
        attributes: [
          'project_id',
          [Sequelize.fn('COUNT', Sequelize.col('project_id')), 'totalTasks'],
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal(
                'CASE WHEN "status" = \'completed\' THEN 1 ELSE 0 END',
              ),
            ),
            'completedTasks',
          ],
        ],
        group: ['project_id'],
      });
      const projectDetails = projects.map((project) => {
        const participantData = participants.find(
          (p) => p.project_id === project.project_id,
        );
        const taskData = tasks.find((t) => t.project_id === project.project_id);
        return {
          id: project.project_id,
          name: project.project_name,
          category: project.category?.category_name || 'Uncategorized',
          image: project.project_img,
          participantsCount: participantData
            ? parseInt(participantData.getDataValue('participantCount'))
            : 0,
          totalTasks: taskData
            ? parseInt(taskData.getDataValue('totalTasks'))
            : 0,
          completedTasks: taskData
            ? parseInt(taskData.getDataValue('completedTasks'))
            : 0,
        };
      });
      return projectDetails;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getInstructorWorkSpaceTasks(
    project_id: string,
    status?: string,
    task_name?: string,
  ) {
    try {
      const searchCondition = task_name
        ? { title: { [Op.like]: `%${task_name}%` } }
        : {};

      const whereCondition: any = {
        project_id: project_id,
        ...searchCondition,
      };

      if (status) {
        const allowedStatuses = [
          'in_progress',
          'completed',
          'pending_approval',
        ];
        if (!allowedStatuses.includes(status)) {
          throw new HttpException(
            `Invalid status value. Allowed values are: ${allowedStatuses.join(
              ', ',
            )}`,
            HttpStatus.BAD_REQUEST,
          );
        }
        whereCondition.status = status;
      }

      const allTasks = await this.tasksModel.findAll({
        where: whereCondition,
        include: [
          {
            model: Students,
            include: [
              {
                model: Users,
              },
            ],
          },
        ],
      });

      const formattedData = {
        project_id,
        tasks: allTasks,
      };

      return formattedData;
    } catch (error) {
      console.error('Error in getInstructorWorkSpaceTasks:', error.message);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProjectTasksNumber(StudentID: string, project_id: string) {
    try {
      const studentAccount = await this.StudentModel.findOne({
        where: {
          user_id: StudentID,
        },
      });
      if (!studentAccount) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      const tasks = await this.tasksModel.findAll({
        where: {
          project_id: project_id,
          assigned_to: studentAccount.user_id,
          status: 'in_progress',
        },
      });
      if (!tasks) {
        return { UncompletedTasks: 0, ClosestTimeToSubmit: null };
      }
      const closestTask = tasks.reduce((closest, task) => {
        const taskDueDate = new Date(task.due_date);
        const closestDueDate = closest ? new Date(closest.due_date) : null;
        return !closestDueDate || taskDueDate < closestDueDate ? task : closest;
      }, null);
      return {
        UncompletedTasks: tasks.length,
        ClosestTimeToSubmit: closestTask ? closestTask.due_date : null,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getHomeProjectDetails(projectID: string) {
    try {
      const projectDetails = await this.ProjectModel.findOne({
        where: {
          project_id: projectID,
        },
        include: [
          {
            model: Instructors,
            include: [
              {
                model: Users,
              },
            ],
          },
          {
            model: Categories,
            as: 'category',
          },
        ],
      });
      //   const participants = await this.acceptedStudentsModel.findAll({
      //     where: {
      //       project_id: projectID,
      //     },
      //     include: [
      //       {
      //         model: Students,
      //         include: [
      //           {
      //             model: Users,
      //           },
      //         ],
      //       },
      //     ],
      //   });
      //   return { project: projectDetails, number: participants.length };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async projectsForAdmin(search: string, page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;
      const whereConditions: any = {
        project_name: {
          [Op.like]: `%${search}%`,
        },
      };

      const { rows, count } = await this.ProjectModel.findAndCountAll({
        where: whereConditions,
        limit: limit, 
        offset: offset, 
        include: [
          {
            model: Categories,
          },
          {
            model: Instructors,
            include: [
              {
                model: Users,
              },
            ],
          },
          {
            model: Tasks,
          },
          {
            model: ProjectParticipants,
            required: false, 
          },
        ],
      });

      const projectsWithMemberCounts = rows.map((project) => {
        const acceptedParticipants = project.participants.filter(
          (participant) => participant.accepted === 2,
        );

        return {
          ...project.get(),
          numberOfMembers: acceptedParticipants.length,
        };
      });

      const totalPages = Math.ceil(count / limit);

      return {
        projects: projectsWithMemberCounts,
        totalPages,
        currentPage: page,
        totalItems: count,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllJoinedStudents(project_id: string) {
    try {
      const joinedStudents = await this.participantsModel.findAll({
        where: {
          project_id: project_id,
          accepted: 2,
        },
        include: [
          {
            model: Students,
            include: [
              {
                model: Users,
              },
            ],
          },
        ],
      });
      return joinedStudents;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async viewProjectsStatistics(instructorID: string, project_id: string) {
    try {
      const instructorProject = await this.ProjectModel.findByPk(project_id);
      if (!instructorProject) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
  
      // Get task counts
      const tasks = await this.tasksModel.findAll({
        where: { project_id: instructorProject.project_id },
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('status')), 'count'],
        ],
        group: ['status'],
      });
  
      const taskCounts = {
        total: 0,
        in_progress: 0,
        completed: 0,
        pending_approval: 0,
      };
  
      tasks.forEach((task) => {
        const status = task.getDataValue('status') as keyof typeof taskCounts;
        const count = Number(task.getDataValue('count'));
        taskCounts[status] = count;
        taskCounts.total += count;
      });
  
      // Get participant counts
      const participants = await this.participantsModel.findAll({
        where: { project_id: instructorProject.project_id },
        attributes: [
          'accepted',
          [Sequelize.fn('COUNT', Sequelize.col('accepted')), 'count'],
        ],
        group: ['accepted'],
      });
  
      const participantCounts = {
        pending: 0,
        accepted: 0,
        rejected: 0,
      };
  
      participants.forEach((participant) => {
        const accepted = participant.getDataValue('accepted');
        const count = Number(participant.getDataValue('count'));
  
        if (accepted === 1) participantCounts.pending = count;
        else if (accepted === 2) participantCounts.accepted = count;
        else if (accepted === 3) participantCounts.rejected = count;
      });
  
      return {
        numberOfAllTasks: taskCounts.total,
        numberOfPendingTasks: taskCounts.pending_approval,
        numberOfCompletedTasks: taskCounts.completed,
        numberOfInProgressTasks: taskCounts.in_progress,
        numberOfPendingStudents: participantCounts.pending,
        numberOfAcceptedStudents: participantCounts.accepted,
        numberOfRejectedStudents: participantCounts.rejected,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async homeProjectDetails(project_id: string) {
    try {
      const project = await this.ProjectModel.findOne({
        where: {
          project_id: project_id,
        },
        include: [
          {
            model: ProjectParticipants,
            include: [
              {
                model: Students,
              },
            ],
          },
          {
            model: Categories,
          },
        ],
      });
      return project;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
