import { Module } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Jwtservice } from 'src/auth/jwt-service/jwt-service.service';
import { JwtServiceModule } from 'src/auth/jwt-service/jwt-service.module';
import { BcryptService } from 'src/auth/bcrypt/bcrypt.service';
import { modelsProviders } from 'src/providers/models.providers';

@Module({
  imports: [DatabaseModule, JwtServiceModule],
  controllers: [ContactUsController],
  providers: [ContactUsService, Jwtservice, BcryptService, ...modelsProviders],
})
export class ContactUsModule {}
