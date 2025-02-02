import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Courses } from 'src/database/entities/course.entity';
import { Instructors } from 'src/database/entities/instructor.entity';
import { Users } from 'src/database/entities/user.entity';
import { Categories } from 'src/database/entities/category.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { Contents } from 'src/database/entities/course-videos.entity';
import { PaymentService } from 'src/payment/payment.service';
import { Op, where } from 'sequelize';
import { UpdateContentDto } from './dto/update-content.dto';
import { Enrollments } from 'src/database/entities/enrollment.entity';
import { Ratings } from 'src/database/entities/rate.entity';
import { Payments } from 'src/database/entities/payment.entity';

@Injectable()
export class CourseService {
  constructor(
    @Inject('COURSE_REPOSITORY') private readonly CourseModel: typeof Courses,
    @Inject('INSTRUCTOR_REPOSITORY')
    private readonly InstructorModel: typeof Instructors,
    @Inject('CONTENT_REPOSITORY')
    private readonly contentModel: typeof Contents,
    private readonly paymentService: PaymentService,
    @Inject('ENROLLMENTS')
    private readonly enrollmentsModel: typeof Enrollments,
    @Inject('PAYMENTS')
    private readonly paymentsModel: typeof Payments,
    @Inject('RATINGS')
    private readonly ratingsModel: typeof Ratings,
  ) {}

  async getAllCourses(courseName?: string, categories?: string[]) {
    try {
      const whereCondition: any = { is_deleted: false };

      // Add course name filtering if provided
      if (courseName) {
        whereCondition.course_name = { [Op.like]: `%${courseName}%` };
      }

      // Add category filtering if provided
      if (categories && categories.length > 0) {
        // Assuming categories are passed as strings (IDs), convert them to numbers
        const categoryIds = categories
          .map((id) => Number(id))
          .filter((id) => !isNaN(id));
        if (categoryIds.length > 0) {
          whereCondition.course_category = { [Op.in]: categoryIds };
        }
      }

      const allCourses = await this.CourseModel.findAll({
        where: whereCondition, // Removed redundant is_deleted: false
        include: [
          {
            model: Instructors,
            attributes: ['major'],
            include: [
              {
                model: Users,
                attributes: ['user_name'],
              },
            ],
          },
          {
            model: Categories,
            attributes: ['category_name'],
          },
        ],
      });

      return allCourses;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCourseDetails(courseID: string, studentID: string, role: any) {
    try {
      const course = await this.CourseModel.findByPk(courseID);
      if (course.is_deleted == true) {
        return 'This course has been deleted and is no longer available.';
      }
      const studentSubscription =
        await this.paymentService.getSubscriptionStatus(studentID, role);
      let course_content: any;
      //   console.log(studentSubscription.status);
      if (studentSubscription.status == 'active') {
        course_content = await this.contentModel.findAll({
          where: {
            course_id: courseID,
            is_deleted: false,
          },
        });
      } else if (role != '1') {
        course_content = await this.contentModel.findAll({
          where: {
            course_id: courseID,
            is_deleted: false,
          },
        });
      } else {
        course_content = await this.contentModel.findOne({
          where: {
            course_id: courseID,
            is_deleted: false,
          },
          order: [['createdAt', 'ASC']],
        });
      }
      return course_content;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createNewCourse(
    createCourseDto: CreateCourseDto,
    course_img: string,
    instructorID: string,
  ) {
    try {
      const instructor = await this.InstructorModel.findOne({
        where: { instructor_id: instructorID },
      });
      const newCourse = await this.CourseModel.create({
        course_name: createCourseDto.course_name,
        course_description: createCourseDto.course_description,
        course_category: createCourseDto.course_category,
        course_img: course_img,
        created_at: new Date(),
        course_instructor: instructor.id,
        is_deleted: true,
      });
      return newCourse;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async activateCourse(courseID: string) {
    try {
      //   console.log(courseID);
      const theCourse = await this.CourseModel.findByPk(courseID);
      if (theCourse.is_deleted === false) {
        await this.CourseModel.update(
          {
            is_deleted: true,
          },
          {
            where: {
              course_id: courseID,
            },
          },
        );
        return 'The course deleted successfully!';
      }
      {
        await this.CourseModel.update(
          {
            is_deleted: false,
          },
          {
            where: {
              course_id: courseID,
            },
          },
        );

        return 'The course activate successfully!';
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllInstructorCourses(instructorID: string, courseName?: string) {
    try {
      const instructor_user = await this.InstructorModel.findOne({
        where: { instructor_id: instructorID },
      });
      const whereClause: any = {
        course_instructor: instructor_user.id,
      };
      if (courseName) {
        whereClause.course_name = {
          [Op.like]: `%${courseName}%`,
        };
      }
      const allCourses = await this.CourseModel.findAll({
        where: whereClause,
        include: [
          {
            model: Instructors,
            attributes: ['major'],
            include: [
              {
                model: Users,
                attributes: ['user_name'],
              },
            ],
          },
          {
            model: Categories,
            attributes: ['category_name'],
          },
        ],
      });
      return allCourses;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
    course_img: string,
  ) {
    try {
      const course = await this.CourseModel.findByPk(id);
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
      const updatedCourse = await course.update({
        course_name: updateCourseDto.course_name || course.course_name,
        course_description:
          updateCourseDto.course_description || course.course_description,
        course_category:
          updateCourseDto.course_category || course.course_category,
        course_img: course_img || course.course_img,
      });
      return updatedCourse;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeCourse(id: string) {
    try {
      const myCourse = await this.CourseModel.findByPk(id);
      if (myCourse.is_deleted === false) {
        const [numberOfAffectedRows] = await this.CourseModel.update(
          { is_deleted: true },
          { where: { course_id: id } },
        );
        if (numberOfAffectedRows === 0) {
          throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
        }
        return { message: 'Course marked as deleted successfully' };
      } else {
        const [numberOfAffectedRows] = await this.CourseModel.update(
          { is_deleted: false },
          { where: { course_id: id } },
        );
        if (numberOfAffectedRows === 0) {
          throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
        }
        return { message: 'Course updated successfully' };
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCourseContent(
    createContentDto: CreateContentDto,
    courseID: bigint,
    vidURL: string,
  ) {
    try {
      const newContent = await this.contentModel.create({
        video_title: createContentDto.video_title,
        video_description: createContentDto.video_description,
        video_url: vidURL,
        course_id: courseID,
      });
      return { newContent, status: 201 };
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateOnContent(
    updateContentDto: UpdateContentDto,
    courseID: bigint,
    contentID: bigint,
    vidURL: string,
  ) {
    try {
      const courseSection = await this.contentModel.findOne({
        where: {
          course_id: courseID,
          video_id: contentID,
        },
      });
      if (!courseSection) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }
      if (vidURL) {
        courseSection.update({ video_url: vidURL });
      }
      const updatedData = {
        video_title: updateContentDto.video_title || courseSection.video_title,
        video_description:
          updateContentDto.video_description || courseSection.video_description,
      };
      await courseSection.update(updatedData);
      return courseSection;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteContent(courseID: bigint, contentID: bigint) {
    try {
      const deletedContent = await this.contentModel.findOne({
        where: {
          video_id: contentID,
          course_id: courseID,
        },
      });
      deletedContent.update({
        is_deleted: true,
      });
      return { status: 201 };
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addToMyCourseList(courseID: bigint, studentID: string) {
    try {
      const courseList = await this.enrollmentsModel.findOne({
        where: { student_id: studentID, course_id: courseID },
      });
      const courseToList = await this.CourseModel.findByPk(courseID);
      if (courseToList.is_deleted === true) {
        return 'this course was deleted from instructor';
      }
      if (!courseList) {
        await this.enrollmentsModel.create({
          student_id: studentID,
          course_id: courseID,
        });
        return 'The course saved successfully!';
      } else {
        await this.enrollmentsModel.destroy({
          where: { student_id: studentID, course_id: courseID },
        });
        return 'The course was removed successfully!';
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMyCourseList(studentID: string) {
    try {
      const myList = await this.enrollmentsModel.findAll({
        where: {
          student_id: studentID,
          payed_for: true,
        },
        attributes: ['course_id'],
      });
      if (!myList.length) {
        return 'You do not have any listed courses!';
      }
      const courseIds = myList.map((enrollment) => enrollment.course_id);
      const courses = await this.CourseModel.findAll({
        where: {
          course_id: {
            [Op.in]: courseIds,
          },
        },
        include: [
          { model: Instructors, include: [{ model: Users }] },
          { model: Categories },
        ],
      });
      return courses;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addRate(
    studentID: string,
    CourseID: bigint,
    role: number,
    newRating: number,
  ) {
    try {
      const studentSubscription =
        await this.paymentService.getSubscriptionStatus(studentID, role);
      if (studentSubscription.status === 'active') {
        const myList = await this.enrollmentsModel.findOne({
          where: {
            student_id: studentID,
            course_id: CourseID,
          },
        });
        if (myList.dataValues.payed_for === false) {
          return 'You need to pay for the course to rate it!';
        }
        if (myList) {
          const rating = await this.ratingsModel.findOne({
            where: {
              rating_user: studentID,
              rating_on: CourseID,
            },
          });
          if (rating) {
            return 'You have already rated this course before!';
          } else {
            await this.ratingsModel.create({
              rating_user: studentID,
              rating_on: CourseID,
              rating: newRating,
            });
            const courseRatings = await this.ratingsModel.findAll({
              where: {
                rating_on: CourseID,
              },
              attributes: ['rating'],
            });
            const averageRating =
              courseRatings.reduce((sum, rating) => sum + rating.rating, 0) /
              courseRatings.length;
            await this.CourseModel.update(
              { rating: averageRating },
              { where: { course_id: CourseID } },
            );
            return 'Rating submitted successfully!';
          }
        } else {
          return 'You don`t have this course on your list!';
        }
      } else {
        return 'You don`t have subscription!';
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async topCoursesRate() {
    try {
      const topRatedCourses = await this.CourseModel.findAll({
        where: {
          is_deleted: false,
        },
        limit: 4,
        order: [['rating', 'DESC']],
        include: [
          {
            model: Categories,
          },
          {
            model: Instructors,
            as: 'instructor',
            include: [
              {
                model: Users,
              },
            ],
          },
        ],
      });
      return topRatedCourses;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async coursePage(courseID: string) {
    try {
      const courseDetails = await this.CourseModel.findOne({
        where: {
          course_id: courseID,
        },
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
        ],
      });
      const courseContent = await this.contentModel.findAll({
        where: {
          course_id: courseID,
          is_deleted: false,
        },
      });
      const enrollments = await this.enrollmentsModel.findAll({
        where: {
          course_id: courseID,
        },
      });
      return {
        course: courseDetails,
        content: courseContent,
        enrollments: enrollments.length,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUnSubCourses(StudentID: string) {
    try {
      const unSubCourses = await this.enrollmentsModel.findAll({
        where: {
          student_id: StudentID,
          payed_for: false,
        },
        include: [
          {
            model: Courses,
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
            ],
          },
        ],
      });
      return unSubCourses;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCourseViewStatistics(instructorID: string, courseID: string) {
    try {
      // Fetch the course by its primary key (courseID)
      const course = await this.CourseModel.findByPk(courseID);
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      // Fetch all students enrolled in the course who have paid
      const students = await this.enrollmentsModel.findAll({
        where: {
          course_id: course.course_id,
        },
      });

      // Calculate total earnings (assuming each student pays $4)
      const numberOfStudents = students.length;
      const earnings = numberOfStudents * 4;

      // Define the number of weeks to include in the trend
      const numberOfWeeks = 4;
      const trendData = [];

      // Get today's date
      const today = new Date();

      for (let i = numberOfWeeks - 1; i >= 0; i--) {
        // Calculate the start of the week (Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() - i * 7);
        startOfWeek.setHours(0, 0, 0, 0); // Reset to midnight

        // Calculate the end of the week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999); // End of day

        // Count the number of students registered in this week using createdAt
        const weeklyRegistrations = await this.enrollmentsModel.count({
          where: {
            course_id: course.course_id,
            createdAt: {
              [Op.between]: [startOfWeek, endOfWeek],
            },
          },
        });

        // Push the data to the trendData array
        trendData.push({
          weekStart: startOfWeek.toISOString().split('T')[0], // Format: YYYY-MM-DD
          weekEnd: endOfWeek.toISOString().split('T')[0],
          registeredStudents: weeklyRegistrations,
        });
      }

      // Return the statistics along with the trend data
      return {
        earnings,
        trendData,
        numberOfStudents,
      };
    } catch (error) {
      console.error('Error in getCourseViewStatistics:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllCoursesFormAdmin(courseName?: string) {
    try {
      const whereCondition: any = { is_deleted: false };
      if (courseName) {
        whereCondition.course_name = { [Op.like]: `%${courseName}%` };
      }
      const allCourses = await this.CourseModel.findAll({
        include: [
          {
            model: Instructors,
            attributes: ['major'],
            include: [
              {
                model: Users,
                attributes: ['user_name'],
              },
            ],
          },
          {
            model: Categories,
            attributes: ['category_name'],
          },
        ],
      });
      return allCourses;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
