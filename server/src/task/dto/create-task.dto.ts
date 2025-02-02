import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(10, { message: 'Title must be at least 10 characters long' })
  @MaxLength(50, {
    message: 'Title must be less than or equal to 50 characters long',
  })
  @ApiProperty({
    description: 'The title of the task',
    type: 'string',
    required: true,
    example: 'Car Renting Application',
  })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @ApiProperty({
    description:
      'Details about the task, e.g., "This is a React Native app for car renting."',
    type: 'string',
    required: true,
    example: 'This is a React Native app for car renting.',
  })
  description: string;

  @IsOptional()
  @IsDate({ message: 'Due date must be a valid date' })
  @ApiProperty({
    type: 'date',
    required: false,
    example: '2025-04-07',
  })
  due_date: Date;
}
