import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create/create-user.dto';
import { Users } from 'src/database/entities/user.entity';
import { Jwtservice } from 'src/auth/jwt-service/jwt-service.service';
import { BcryptService } from 'src/auth/bcrypt/bcrypt.service';
import { Students } from 'src/database/entities/student.entity';
import { Sequelize, where } from 'sequelize';
import { SignInDto } from './dto/sign-in.dto';
import { Instructors } from 'src/database/entities/instructor.entity';
import { StudentFormDto } from './dto/update/update-student.dto';
import { InstructorFormDto } from './dto/update/update-Instructor.dto';
import { CreateAdminDto } from './dto/create/create-admin.dto';
import { Admins } from 'src/database/entities/admin.entity';
import { Feedback } from 'src/database/entities/FAQ.entity';
import { Op } from 'sequelize';
import { Projects } from 'src/database/entities/project.entity';
import { Categories } from 'src/database/entities/category.entity';
import { Enrollments } from 'src/database/entities/enrollment.entity';
import { Skills } from 'src/database/entities/skills.entity';
import { Links } from 'src/database/entities/link.entity';
import { Courses } from 'src/database/entities/course.entity';
import { ProjectParticipants } from 'src/database/entities/Project-Participants.entity';
import { Tasks } from 'src/database/entities/project-task.entity';
import { Payments } from 'src/database/entities/payment.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly UserModel: typeof Users,
    @Inject('STUDENT_REPOSITORY')
    private readonly StudentModel: typeof Students,
    @Inject('INSTRUCTOR_REPOSITORY')
    private readonly InstructorModel: typeof Instructors,
    @Inject('ADMIN_REPOSITORY')
    private readonly adminModel: typeof Admins,
    @Inject('PROJECTS_REPOSITORY')
    private readonly ProjectModel: typeof Projects,
    @Inject('FEEDBACK')
    private readonly feedbackModel: typeof Feedback,
    @Inject('LINKS')
    private readonly linkModel: typeof Links,
    @Inject('TASKS')
    private readonly tasksModel: typeof Tasks,
    @Inject('ENROLLMENTS')
    private readonly enrollmentsModel: typeof Enrollments,
    @Inject('PAYMENTS')
    private readonly paymentModel: typeof Payments,
    @Inject('SKILLS')
    private readonly skillsModel: typeof Skills,
    @Inject('PROJECTPARTICIPANTS')
    private readonly participantsModel: typeof ProjectParticipants,
    @Inject('COURSE_REPOSITORY') private readonly CourseModel: typeof Courses,
    private readonly jwtService: Jwtservice,
    private readonly bcryptService: BcryptService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async StudentSignUp(createStudentDto: CreateUserDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const hashedPassword = await this.bcryptService.hash(
        createStudentDto.password,
      );
      const userAccount = await this.UserModel.findOne({
        where: {
          user_email: createStudentDto.user_email,
          phone_number: createStudentDto.phone_number,
        },
      });
      if (userAccount) {
        throw new ConflictException();
      }
      const newUser = await this.UserModel.create(
        {
          user_name: createStudentDto.user_name,
          user_email: createStudentDto.user_email,
          password: hashedPassword,
          phone_number: createStudentDto.phone_number,
          role: 1,
        },
        { transaction },
      );
      await this.StudentModel.create(
        { user_id: newUser.dataValues.user_id },
        { transaction },
      );
      await transaction.commit();
      const access_token = await this.jwtService.generateAccessToken(
        newUser.dataValues.user_id,
        newUser.dataValues.user_email,
        newUser.dataValues.role,
      );
      const refreshToken = await this.jwtService.generateRefreshToken(
        newUser.dataValues.user_id,
        newUser.dataValues.user_email,
        newUser.dataValues.role,
      );
      return {
        status: 'success',
        access_token,
        refreshToken,
        role: newUser.role,
      };
    } catch (error) {
      await transaction.rollback();
      console.error(error);
    }
  }

  async instructorSignUp(createInstructorDto: CreateUserDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const userAccount = await this.UserModel.findOne({
        where: {
          user_email: createInstructorDto.user_email,
          phone_number: createInstructorDto.phone_number,
        },
      });
      if (userAccount) {
        throw new ConflictException();
      }
      const hashedPassword = await this.bcryptService.hash(
        createInstructorDto.password,
      );
      const newUser = await this.UserModel.create(
        {
          user_name: createInstructorDto.user_name,
          user_email: createInstructorDto.user_email,
          password: hashedPassword,
          phone_number: createInstructorDto.phone_number,
          role: 2,
        },
        { transaction },
      );
      await this.InstructorModel.create(
        {
          instructor_id: newUser.dataValues.user_id,
          major: createInstructorDto.major,
        },
        { transaction },
      );
      await transaction.commit();
      const token = await this.jwtService.generateAccessToken(
        newUser.dataValues.user_id,
        newUser.dataValues.user_email,
        newUser.dataValues.role,
      );
      const refreshToken = await this.jwtService.generateRefreshToken(
        newUser.dataValues.user_id,
        newUser.dataValues.user_email,
        newUser.dataValues.role,
      );
      const role = newUser.role;
      return { token, refreshToken, role };
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  }

  async createAdminAccount(createAdminDto: CreateAdminDto, adminIMG: string) {
    const transaction = await this.sequelize.transaction();
    try {
      const hashedPassword = await this.bcryptService.hash(
        createAdminDto.password,
      );
      const newAdmin = await this.UserModel.create(
        {
          user_name: createAdminDto.user_name,
          user_email: createAdminDto.user_email,
          password: hashedPassword,
          phone_number: createAdminDto.phone_number,
          role: 3,
          user_img: adminIMG,
        },
        { transaction },
      );
      await this.adminModel.create(
        {
          user_id: newAdmin.dataValues.user_id,
          department: createAdminDto.department,
        },
        { transaction },
      );
      await transaction.commit();
      return newAdmin;
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async userInfo(userID: string) {
    try {
      const userInfo = await this.UserModel.findByPk(userID);
      if (!userInfo) throw new NotFoundException();
      return userInfo;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(clientSignInDto: SignInDto) {
    try {
      const user = await this.UserModel.findOne({
        where: { user_email: clientSignInDto.user_email },
      });
      if (!user) throw new NotFoundException();
      if (user.is_deleted) {
        return {
          message: 'Account with email ${user.user_email} is not Active',
        };
      }
      const passwordCompare = await this.bcryptService.compare(
        clientSignInDto.password,
        user.dataValues.password,
      );
      if (!passwordCompare) throw new UnauthorizedException();
      const accessToken = await this.jwtService.generateAccessToken(
        user.dataValues.user_id,
        user.dataValues.user_email,
        user.dataValues.role,
      );
      const refreshToken = await this.jwtService.generateRefreshToken(
        user.dataValues.user_id,
        user.dataValues.user_email,
        user.dataValues.role,
      );
      const userRole = user.role;
      return { accessToken, refreshToken, userRole };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async setStudentInformation(
    studentID: string,
    studentForm: StudentFormDto,
    profileIMG: string,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const student = await this.StudentModel.findOne({
        where: {
          user_id: studentID,
        },
        transaction,
      });
      if (!student) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      // Update student general information
      await student.update(
        {
          university_name: studentForm.university_name,
          major: studentForm.major,
          about_me: studentForm.about_me,
        },
        { transaction },
      );
      await this.UserModel.update(
        {
          user_img: profileIMG || student.dataValues.user_img,
          phone_number: studentForm.phone_number,
          user_name: studentForm.user_name,
        },
        { where: { user_id: studentID }, transaction },
      );
      // Handle skills
      const skills = JSON.parse(studentForm.skills);
      const existingSkills = await this.skillsModel.findAll({
        where: { user_id: studentID },
        transaction,
      });
      const existingSkillIds = existingSkills.map((skill) => skill.skill_id);
      const skillsToUpdate = [];
      const skillsToCreate = [];
      const skillsToDelete = existingSkillIds;
      for (const skill of skills) {
        if (skill.skill_id) {
          // Existing skill
          skillsToUpdate.push(skill);
          // Remove from skillsToDelete since it still exists
          const index = skillsToDelete.indexOf(skill.skill_id);
          if (index !== -1) skillsToDelete.splice(index, 1);
        } else {
          // New skill
          skillsToCreate.push({
            skill_name: skill.skill_name,
            user_id: studentID,
          });
        }
      }
      // Update existing skills
      for (const skill of skillsToUpdate) {
        await this.skillsModel.update(
          { skill_name: skill.skill_name },
          { where: { skill_id: skill.skill_id }, transaction },
        );
      }
      // Create new skills
      console.log('Create new skills', skillsToCreate.length);
      if (skillsToCreate.length > 0) {
        await this.skillsModel.bulkCreate(skillsToCreate, { transaction });
      }
      // Delete removed skills
      if (skillsToDelete.length > 0) {
        await this.skillsModel.destroy({
          where: { skill_id: skillsToDelete },
          transaction,
        });
      }
      const links = JSON.parse(studentForm.links); // Parse links JSON string
      console.log('Parsed links:', links);
      const existingLinks = await this.linkModel.findAll({
        where: { user_link: studentID },
        transaction,
      });
      const existingLinkIds = existingLinks.map((link) => link.link_id);
      const linksToUpdate = [];
      const linksToCreate = [];
      const linksToDelete = [...existingLinkIds];
      console.log('Existing Link IDs:', existingLinkIds);
      // Check each link in the input
      for (const link of links) {
        if (existingLinkIds.includes(link.link_id)) {
          const index = linksToDelete.indexOf(link.link_id);
          if (index !== -1) linksToDelete.splice(index, 1); // Remove from delete list
          linksToUpdate.push(link);
        } else {
          // New link (no link_id) or new link_id not found - generate a new link_id
          link.link_id = Date.now();
          linksToCreate.push({
            link_name: link.link_name,
            link: link.link,
            user_link: studentID,
          });
        }
      }
      if (linksToUpdate.length > 0) {
        for (const link of linksToUpdate) {
          try {
            await this.linkModel.update(
              { link_name: link.link_name, link: link.link },
              {
                where: { link_id: link.link_id, user_link: studentID },
                transaction,
              },
            );
            console.log(`Updated link with id: ${link.link_id}`);
          } catch (error) {
            console.error(
              `Error updating link with id: ${link.link_id}`,
              error,
            );
            throw error;
          }
        }
      }
      // Create new links
      if (linksToCreate.length > 0) {
        try {
          console.log('Creating new links:', linksToCreate);
          await this.linkModel.bulkCreate(linksToCreate, { transaction });
        } catch (error) {
          console.error('Error creating new links:', error);
          throw error; // Re-throw the error for further handling
        }
      }
      // Delete removed links
      if (linksToDelete.length > 0) {
        try {
          console.log('Deleting removed links:', linksToDelete);
          await this.linkModel.destroy({
            where: { link_id: linksToDelete, user_link: studentID },
            transaction,
          });
        } catch (error) {
          console.error('Error deleting removed links:', error);
          throw error;
        }
      }
      await transaction.commit();
      return student.dataValues;
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async setInstructorInformation(
    instructorID: string,
    instructorForm: InstructorFormDto,
    instructorImage: string,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      console.log(instructorForm);
      // Find the instructor
      const instructor = await this.InstructorModel.findOne({
        where: {
          instructor_id: instructorID,
        },
        transaction,
      });
      const instructorAccount = await this.UserModel.findByPk(instructorID, {
        transaction,
      });
      if (!instructor) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Update general instructor information
      const instructorData = await instructor.update(
        {
          major: instructorForm.major,
          about_me: instructorForm.about_me,
        },
        { transaction },
      );

      // Update user information
      await this.UserModel.update(
        {
          user_name: instructorForm.user_name,
          user_img: instructorImage || instructorAccount.user_img,
          phone_number: instructorForm.phone_number,
        },
        { where: { user_id: instructorID }, transaction },
      );

      console.log(instructor.id);
      // Delete all existing skills
      await this.skillsModel.destroy({
        where: { instructor_id: instructor.id },
        transaction,
      });

      // Recreate skills
      const skills = JSON.parse(instructorForm.skills);
      if (skills.length > 0) {
        const skillsToCreate = skills.map((skill: any) => ({
          skill_name: skill.skill_name,
          instructor_id: instructor.id,
        }));
        await this.skillsModel.bulkCreate(skillsToCreate, { transaction });
      }

      // Delete all existing links
      await this.linkModel.destroy({
        where: { instructor_link: instructor.id },
        transaction,
      });

      // Recreate links
      const links = JSON.parse(instructorForm.links); // Parse links JSON string
      console.log('Parsed links:', links);
      if (Array.isArray(links) && links.length > 0) {
        const linksToCreate = links.map((link: any) => ({
          link_name: link.link_name,
          link: link.link,
          instructor_link: instructorAccount.user_id,
        }));

        await this.linkModel.bulkCreate(linksToCreate, { transaction });
      }

      // Commit transaction
      await transaction.commit();
      return instructorData.dataValues;
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw new HttpException(
        'Failed to update instructor information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async feedback() {
    try {
      const usersFeedback = await this.feedbackModel.findAll({
        include: [
          {
            model: Users,
            include: [
              {
                model: Students,
                required: false,
              },
              {
                model: Instructors,
                required: false,
              },
            ],
          },
        ],
      });
      const results = usersFeedback.map((feedback) => {
        const user = feedback.user;
        if (user.role.toString() === '1') {
          return { ...feedback.toJSON(), relatedUser: user.student };
        } else if (user.role.toString() === '2') {
          return { ...feedback.toJSON(), relatedUser: user.instructor };
        }
        return feedback;
      });
      return results;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async userProfile(userID: string) {
    try {
      const userProfile = await this.UserModel.findByPk(userID);
      console.log(userProfile);
      if (!userProfile) {
        throw new Error('User not found');
      }

      if (userProfile.role.toString() === '1') {
        // Student Role
        const studentProfile = await this.StudentModel.findOne({
          where: {
            user_id: userID,
          },
          include: [
            {
              model: Users,
              as: 'user',
            },
            {
              model: Skills,
              as: 'skills',
            },
            {
              model: Links,
              as: 'user_link',
            },
          ],
        });

        let studentProjects: Projects[] = [];

        if (studentProfile) {
          // Fetch all accepted ProjectParticipants for the student
          const projectParticipants = await this.participantsModel.findAll({
            where: {
              student_id: userID,
              accepted: 2, // 2 => accepted
            },
            include: [
              {
                model: Projects,
                as: 'project',
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
                ],
              },
            ],
          });

          // Extract projects from ProjectParticipants
          studentProjects = projectParticipants.map(
            (participant) => participant.project,
          );
        } else {
          studentProjects = [];
        }

        // Fetch enrolled courses
        const studentCourses = await this.enrollmentsModel.findAll({
          where: {
            student_id: studentProfile.user_id,
            payed_for: true,
          },
          include: [
            {
              model: Courses,
              as: 'course',
            },
          ],
        });

        return {
          user: studentProfile,
          projects: studentProjects,
          courses: studentCourses,
          role: userProfile.role,
        };
      } else if (userProfile.role.toString() === '2') {
        // Instructor Role
        const instructorProfile = await this.InstructorModel.findOne({
          where: {
            instructor_id: userID,
          },
          include: [
            {
              model: Users,
              as: 'user',
            },
          ],
        });

        // Fetch instructor's projects
        const instructorProjects = await this.ProjectModel.findAll({
          where: {
            project_instructor: instructorProfile.id,
          },
          include: [
            {
              model: Categories,
              as: 'category',
            },
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
          ],
        });

        // Fetch instructor's courses
        const instructorCourses = await this.CourseModel.findAll({
          where: {
            course_instructor: instructorProfile.id,
          },
          include: [
            {
              model: Users,
              as: 'user',
            },
          ],
        });

        return {
          user: instructorProfile,
          projects: instructorProjects,
          courses: instructorCourses,
          role: userProfile.role,
        };
      }

      return null;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async popularStudents() {
    try {
      // Step 1: Get the top 3 students with the most accepted projects
      const popularParticipants = await this.participantsModel.findAll({
        attributes: [
          'student_id',
          [Sequelize.fn('COUNT', Sequelize.col('project_id')), 'project_count'],
        ],
        where: { accepted: 2 },
        group: ['student_id'],
        order: [[Sequelize.literal('project_count'), 'DESC']],
        limit: 3,
      });

      // Extract user_ids from the results
      const topUserIds = popularParticipants.map(
        (participant) => participant.student_id,
      );

      if (topUserIds.length === 0) {
        return []; // Return an empty array if no students meet the criteria
      }

      // Step 2: Fetch student details for the top users
      const topStudents = await Students.findAll({
        attributes: ['user_id', 'university_name', 'major', 'about_me'],
        where: { user_id: topUserIds },
        include: [
          {
            model: Users,
            attributes: ['user_name', 'user_email', 'user_img'],
          },
        ],
      });

      return topStudents;
    } catch (error) {
      console.error('Error fetching popular students:', error);
      throw error;
    }
  }

  async getAllUsersById(role: string) {
    try {
      console.log(role);
      let allUsers: any;
      if (role === '1') {
        allUsers = await this.StudentModel.findAll({
          include: [
            {
              model: Users,
            },
          ],
        });
      } else if (role === '2') {
        allUsers = await this.InstructorModel.findAll({
          include: [
            {
              model: Users,
            },
          ],
        });
      } else {
        allUsers = await this.adminModel.findAll({
          include: [
            {
              model: Users,
            },
          ],
        });
      }
      return allUsers;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async userProfilePage(userID: string) {
    try {
      const userProfile = await this.UserModel.findByPk(userID);
      if (!userProfile) {
        throw new Error('User not found');
      }
      if (userProfile.role.toString() === '1') {
        const studentProfile = await this.StudentModel.findOne({
          where: {
            user_id: userID,
          },
          include: [
            {
              model: Users,
              as: 'user',
            },
            {
              model: Skills,
            },
            {
              model: Links,
            },
          ],
        });
        let studentProjects: any = await this.participantsModel.findAll({
          where: {
            student_id: studentProfile.user_id,
            accepted: 2,
          },
          attributes: ['project_id'],
        });
        if (studentProjects && studentProjects.length > 0) {
          const projectIds = studentProjects.map(
            (participant) => participant.project_id,
          );
          studentProjects = await this.ProjectModel.findAll({
            where: {
              project_id: {
                [Op.in]: projectIds,
              },
            },
            include: [
              {
                model: Instructors,
                as: 'instructor',
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
        } else {
          studentProjects = null;
        }
        return {
          user: studentProfile,
          projects: studentProjects,
          role: userProfile.role,
        };
      } else if (userProfile.role.toString() === '2') {
        const instructorProfile = await this.InstructorModel.findOne({
          where: {
            instructor_id: userID,
          },
          include: [
            {
              model: Users,
              as: 'user',
            },
            {
              model: Skills,
            },
            {
              model: Links,
            },
          ],
        });
        const instructorProjects = await this.ProjectModel.findAll({
          where: {
            project_instructor: instructorProfile.id,
          },
          include: [
            {
              model: Instructors,
              as: 'instructor',
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
        const instructorCourses = await this.CourseModel.findAll({
          where: {
            course_instructor: instructorProfile.id,
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
            },
          ],
        });
        return {
          user: instructorProfile,
          projects: instructorProjects,
          courses: instructorCourses,
          role: userProfile.role,
        };
      } else {
        const adminProfile = await this.UserModel.findByPk(userID);
        return {
          user: adminProfile,
          role: adminProfile.role,
        };
      }
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async studentStatistics(studentID: string) {
    try {
      const studentAccount = await this.StudentModel.findOne({
        where: { user_id: studentID },
        include: [
          {
            model: Users,
          },
        ],
      });
      const totalCourses = await this.enrollmentsModel.findAll({
        where: { student_id: studentAccount.user_id },
      });
      const activeCourses = await this.enrollmentsModel.findAll({
        where: {
          student_id: studentAccount.user_id,
          payed_for: true,
        },
      });
      const allProjects = await this.participantsModel.findAll({
        where: {
          student_id: studentAccount.user_id,
          accepted: 2,
        },
        include: [
          {
            model: Projects,
          },
        ],
      });
      const projectIds = allProjects.map((project) => project.project_id);
      const completedProjects = await this.ProjectModel.findAll({
        where: {
          project_id: {
            [Op.in]: projectIds,
          },
          end_date: {
            [Op.lt]: new Date(),
          },
        },
      });
      const upComingDeadlines = await this.ProjectModel.findAll({
        where: {
          project_id: {
            [Op.in]: projectIds,
          },
          end_date: {
            [Op.gt]: new Date(),
          },
        },
      });
      let profileCompleted = 0;
      if (studentAccount.about_me) {
        profileCompleted = profileCompleted + 20;
      }
      if (studentAccount.university_name) {
        profileCompleted = profileCompleted + 20;
      }
      if (studentAccount.major) {
        profileCompleted = profileCompleted + 20;
      }
      const studentUserTable = await this.UserModel.findByPk(studentID);
      if (studentUserTable.user_img) {
        profileCompleted = profileCompleted + 20;
      }
      const links = await this.linkModel.findAll({
        where: { user_link: studentID },
      });
      if (links.length > 0) {
        profileCompleted = profileCompleted + 20;
      }
      let projectsProgress = [];
      for (const project of upComingDeadlines) {
        const projectId = project.project_id;
        const tasks = await this.tasksModel.findAll({
          where: {
            project_id: projectId,
          },
        });
        // Calculate progress
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
          (task) => task.status === 'completed',
        ).length;
        let progressPercentage =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        projectsProgress.push({
          name: project.project_name,
          data: [Math.round(progressPercentage)],
        });
      }
      return {
        totalCourses: totalCourses.length,
        activeCourses: activeCourses.length,
        completedProjects: completedProjects.length,
        upComingDeadlines: upComingDeadlines.length,
        profileCompleted,
        projectsProgress,
      };
    } catch (error) {
      throw new Error(`Failed to fetch user statistics: ${error.message}`);
    }
  }

  async adminStatistics() {
    try {
      const totalCourses = await this.CourseModel.findAll();
      const totalProjects = await this.ProjectModel.findAll();
      let monthPayment = await this.paymentModel.findAll({
        where: {
          activate: true,
        },
      });
      const payment = monthPayment.length * 5;
      let inProgressProjects = await this.ProjectModel.findAll({
        where: {
          end_date: {
            [Op.gt]: new Date(),
          },
        },
      });

      return {
        totalCourses: totalCourses.length,
        totalProjects: totalProjects.length,
        monthPayment: payment,
        inProgressProjects: inProgressProjects.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch user statistics: ${error.message}`);
    }
  }

  async instructorStatistics(instructorID: string) {
    try {
      // Fetch the instructor account using the provided instructorID
      const instructorAccount = await this.InstructorModel.findOne({
        where: { instructor_id: instructorID },
      });
      if (!instructorAccount) {
        throw new Error('Instructor not found');
      }
      const instructorId = instructorAccount.id;
      // 1. Total Courses
      const totalCourses = await this.CourseModel.count({
        where: {
          course_instructor: instructorId,
          //   is_deleted: false,
        },
      });

      // 2. Active Courses
      const activeCourses = await this.CourseModel.findAll({
        where: {
          course_instructor: instructorId,
          is_deleted: false,
          // Add additional criteria for "active" courses if applicable
        },
        // Optionally, include related models or specific attributes
      });
      const activeCoursesCount = activeCourses.length;

      // 3. Completed Projects
      const completedProjects = await this.ProjectModel.findAll({
        where: {
          project_instructor: instructorId,
          end_date: {
            [Op.lt]: new Date(),
          },
          is_deleted: false,
        },
      });
      const completedProjectsCount = completedProjects.length;

      // 4. Active Projects (Optional: if you need active projects beyond completed)
      const activeProjects = await this.ProjectModel.findAll({
        where: {
          project_instructor: instructorId,
          active: true,
          is_deleted: false,
        },
      });
      const activeProjectsCount = activeProjects.length;

      // 5. Upcoming Deadlines (Next 30 days)
      const now = new Date();
      const upcomingDate = new Date();
      upcomingDate.setDate(now.getDate() + 30);

      const upcomingDeadlines = await this.ProjectModel.findAll({
        where: {
          project_instructor: instructorId,
          end_date: {
            [Op.between]: [now, upcomingDate],
          },
          is_deleted: false,
        },
        order: [['end_date', 'ASC']],
      });

      // Existing Statistics (Retained from your original function)
      const endedProjects = await this.ProjectModel.findAll({
        where: {
          project_instructor: instructorId,
          end_date: {
            [Op.lt]: new Date(),
          },
          is_deleted: false,
        },
      });

      const awaitProjects = await this.ProjectModel.findAll({
        where: {
          project_instructor: instructorId,
          end_date: {
            [Op.gt]: new Date(),
          },
          is_deleted: false,
        },
      });

      let courses = await this.CourseModel.findAll({
        where: { course_instructor: instructorId, is_deleted: false },
      });
      const coursesID = courses.map((course) => course.course_id);

      const enrollments = await this.enrollmentsModel.findAll({
        where: {
          course_id: { [Op.in]: coursesID },
          payed_for: true,
        },
      });

      const userIDs = enrollments.map((enrollment) => enrollment.student_id);
      const subscriptionStudents = await this.paymentModel.findAll({
        where: { user_id: { [Op.in]: userIDs } },
      });

      const totalCoursesExisting = courses.length;
      const subscribedCourses = new Set(
        enrollments.map((enrollment) => enrollment.course_id),
      );
      const numberOfSubscribedCourses = subscribedCourses.size;
      const subscriptionPercentage =
        totalCoursesExisting > 0
          ? (numberOfSubscribedCourses / totalCoursesExisting) * 100
          : 0;

      const projectStatistics = [];
      for (const project of awaitProjects) {
        // Fetch tasks for the current project
        const tasks = await this.tasksModel.findAll({
          where: { project_id: project.project_id },
        });
        // Count completed tasks
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
          (task) => task.status === 'completed',
        ).length;
        // Calculate the percentage of completed tasks
        const completionPercentage =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        // Add the project statistics to the array
        projectStatistics.push({
          name: project.project_name, // Assuming project has a 'project_name' field
          data: [Math.round(completionPercentage)], // Round for readability
        });
      }

      return {
        // New Statistics
        totalCourses,
        activeCourses: {
          count: activeCoursesCount,
          courses: activeCourses,
        },
        completedProjects: {
          count: completedProjectsCount,
          projects: completedProjects,
        },
        upcomingDeadlines: upcomingDeadlines.map((project) => ({
          project_id: project.project_id,
          project_name: project.project_name,
          end_date: project.end_date,
        })),

        // Existing Statistics
        endedProjects: endedProjects.length,
        awaitProjects: awaitProjects.length,
        paymentMonth: enrollments.length * 5, // Assuming some calculation logic
        subscriptionStudents: subscriptionStudents.length,
        subscriptionPercentage: Math.round(subscriptionPercentage),
        projectStatistics: projectStatistics,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch instructor statistics: ${error.message}`,
      );
    }
  }

  async deleteAccount(user_id: string) {
    try {
      const userAccount = await this.UserModel.findOne({
        where: {
          user_id: user_id,
        },
      });
      if (!userAccount) {
        throw new Error('User not found');
      }
      if (userAccount.is_deleted === true) {
        await this.UserModel.update(
          { is_deleted: false },
          {
            where: {
              user_id: user_id,
            },
          },
        );
      } else {
        await this.UserModel.update(
          { is_deleted: true },
          {
            where: {
              user_id: user_id,
            },
          },
        );
      }
      return {
        message: `Account ${
          userAccount.is_deleted ? 'deleted' : 'restored'
        } successfully`,
      };
    } catch (error) {
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  }
}
