import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import * as mysql from 'mysql2/promise';
import { Roles } from './entities/role.entity';
import { Users } from './entities/user.entity';
import { Students } from './entities/student.entity';
import { Admins } from './entities/admin.entity';
import { Instructors } from './entities/instructor.entity';
import { Courses } from './entities/course.entity';
import { Projects } from './entities/project.entity';
import { Tasks } from './entities/project-task.entity';
import { Contents } from './entities/course-videos.entity';
import { Messages } from './entities/message.entity';
import { Categories } from './entities/category.entity';
import { Links } from './entities/link.entity';
import { Payments } from './entities/payment.entity';
import { Ratings } from './entities/rate.entity';
import { Contactus } from './entities/contact-us.entity';
import { ProjectParticipants } from './entities/Project-Participants.entity';
import * as dotenv from 'dotenv';
import { Enrollments } from './entities/enrollment.entity';
import { Groups } from './entities/groups.entity';
import { GroupMessages } from './entities/group.entitiy';
import { UserGroups } from './entities/user-groups.entity';
import { Feedback } from './entities/FAQ.entity';
import { Skills } from './entities/skills.entity';

dotenv.config();

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const dialect = process.env.DIALECT as Dialect;
      const host = process.env.HOST;
      const port = Number(process.env.DATABASE_PORT);
      const username = process.env.DATABASE_USERNAME;
      const password = process.env.DATABASE_PASSWORD;
      const databaseName = process.env.DATABASE_NAME;
      const checkAndCreateMySQLDB = async () => {
        const connection = await mysql.createConnection({
          host,
          port,
          user: username,
          password,
        });

        try {
          const [databases] = await connection.query(
            `SHOW DATABASES LIKE '${databaseName}'`,
          );
          if ((databases as any).length === 0) {
            await connection.query(`CREATE DATABASE \`${databaseName}\``);
            console.log(`Database "${databaseName}" created.`);
          }
        } catch (error) {
          console.error('Error checking/creating MySQL database:', error);
          throw error;
        } finally {
          await connection.end();
        }
      };

      try {
        await checkAndCreateMySQLDB();
      } catch (error) {
        console.error('Failed to create or check database:', error);
        throw error;
      }
      let sequelize: Sequelize;
      try {
        sequelize = new Sequelize({
          dialect,
          host,
          port,
          username,
          password,
          database: databaseName,
          logging: false,
        });
        sequelize.addModels([
          Users,
          Roles,
          Students,
          Admins,
          Instructors,
          Courses,
          Projects,
          Tasks,
          Contents,
          Messages,
          Categories,
          Links,
          Payments,
          Ratings,
          Contactus,
          ProjectParticipants,
          Enrollments,
          Groups,
          GroupMessages,
          UserGroups,
          Feedback,
          Skills,
        ]);
        await sequelize.sync({ alter: true });
      } catch (error) {
        console.error(
          'Error during Sequelize initialization or model synchronization:',
          error,
        );
        throw error;
      }
      return sequelize;
    },
  },
];
