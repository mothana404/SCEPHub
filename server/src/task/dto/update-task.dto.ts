import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDate,
} from 'class-validator';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(50, {
    message: 'Title must be less than or equal to 50 characters long',
  })
  @ApiProperty({
    description: 'The title of the task',
    type: 'string',
    required: false,
    example: 'Car Renting Application',
  })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @ApiProperty({
    description:
      'Details about the task, e.g., "This is a React Native app for car renting."',
    type: 'string',
    required: false,
    example: 'This is a React Native app for car renting.',
  })
  description?: string;

  @IsOptional()
  @IsDate({ message: 'Due date must be a valid date' })
  @ApiProperty({
    type: 'date',
    required: false,
    example: '2025-04-07',
  })
  due_date?: Date;
}
