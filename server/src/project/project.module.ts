import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { UserService } from 'src/user/user.service';
import { modelsProviders } from 'src/providers/models.providers';
import { DatabaseModule } from 'src/database/database.module';
import { JwtServiceModule } from 'src/auth/jwt-service/jwt-service.module';
import { Jwtservice } from 'src/auth/jwt-service/jwt-service.service';
import { BcryptService } from 'src/auth/bcrypt/bcrypt.service';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [DatabaseModule, JwtServiceModule, UploadModule],
  controllers: [ProjectController],
  providers: [ProjectService, Jwtservice, BcryptService, ...modelsProviders],
})
export class ProjectModule {}
