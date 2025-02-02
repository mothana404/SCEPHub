import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'Course name is required' })
  @IsString({ message: 'Course name must be a string' })
  @MinLength(6, { message: 'Course name must be at least 6 characters long' })
  @MaxLength(30, {
    message: 'Course name must be less than or equal to 30 characters long',
  })
  @ApiProperty({
    description:
      'Course name must be at least 6 characters and not over 30 characters',
    type: 'string',
    required: true,
    example: 'myName',
  })
  course_name: string;

  @IsNotEmpty({ message: 'Course description is required' })
  @IsString({ message: 'Course description must be a string' })
  @MinLength(6, {
    message: 'Course description must be at least 6 characters long',
  })
  @MaxLength(30, {
    message:
      'Course description must be less than or equal to 30 characters long',
  })
  @ApiProperty({
    description:
      'Course description must be at least 6 characters and not over 30 characters',
    type: 'string',
    required: true,
    example: 'This is a course description',
  })
  course_description: string;

  @IsNotEmpty({ message: 'Category is required' })
  @ApiProperty({
    description: 'Category ID must be a valid integer',
    type: 'integer',
    required: true,
    example: 1,
  })
  course_category: number;
}
