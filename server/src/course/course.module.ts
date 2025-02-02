import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtServiceModule } from 'src/auth/jwt-service/jwt-service.module';
import { UploadModule } from 'src/upload/upload.module';
import { modelsProviders } from 'src/providers/models.providers';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  imports: [DatabaseModule, JwtServiceModule, UploadModule],
  controllers: [CourseController],
  providers: [CourseService, ...modelsProviders, PaymentService],
})
export class CourseModule {}
