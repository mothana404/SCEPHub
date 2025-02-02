import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BcryptService } from 'src/auth/bcrypt/bcrypt.service';
import { Jwtservice } from 'src/auth/jwt-service/jwt-service.service';
import { JwtServiceModule } from 'src/auth/jwt-service/jwt-service.module';
import { DatabaseModule } from 'src/database/database.module';
import { UploadModule } from 'src/upload/upload.module';
import { modelsProviders } from 'src/providers/models.providers';

@Module({
  imports: [DatabaseModule, JwtServiceModule, UploadModule],
  controllers: [UserController],
  providers: [UserService, Jwtservice, BcryptService, ...modelsProviders],
})
export class UserModule {}
