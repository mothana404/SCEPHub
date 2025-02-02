import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { EmailController } from './email/email.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtServiceModule } from 'src/auth/jwt-service/jwt-service.module';
import { Jwtservice } from 'src/auth/jwt-service/jwt-service.service';
import { BcryptService } from 'src/auth/bcrypt/bcrypt.service';
import { modelsProviders } from 'src/providers/models.providers';

@Module({
  imports: [DatabaseModule, JwtServiceModule],
  providers: [EmailService, Jwtservice, BcryptService, ...modelsProviders],
  controllers: [EmailController],
})
export class EmailModule {}
