import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { ProjectModule } from './project/project.module';
import { ChatModule } from './chat/chat.module';
import { PaymentModule } from './payment/payment.module';
import { ContactUsModule } from './contact-us/contact-us.module';
import { DatabaseModule } from './database/database.module';
import { BcryptService } from './auth/bcrypt/bcrypt.service';
import { CategoryModule } from './category/category.module';
import { TaskModule } from './task/task.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    UserModule,
    CourseModule,
    ProjectModule,
    ChatModule,
    PaymentModule,
    ContactUsModule,
    DatabaseModule,
    CategoryModule,
    TaskModule,
    // EmailModule,
  ],
  controllers: [],
  providers: [BcryptService],
})
export class AppModule {}
