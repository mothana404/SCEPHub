import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { modelsProviders } from 'src/providers/models.providers';
import { JwtServiceModule } from 'src/auth/jwt-service/jwt-service.module';

@Module({
  imports: [JwtServiceModule],
  controllers: [CategoryController],
  providers: [CategoryService, ...modelsProviders],
})
export class CategoryModule {}
