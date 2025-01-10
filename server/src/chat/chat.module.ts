import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { DatabaseModule } from 'src/database/database.module';
import { JwtServiceModule } from 'src/auth/jwt-service/jwt-service.module';
import { modelsProviders } from 'src/providers/models.providers';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, JwtServiceModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ...modelsProviders, JwtService],
})
export class ChatModule {}
