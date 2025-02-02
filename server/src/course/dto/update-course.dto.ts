import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Name of the course',
    type: 'string',
    required: false,
    example: 'Updated Course Name',
  })
  course_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Description of the course',
    type: 'string',
    required: false,
    example: 'Updated Course Description',
  })
  course_description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Category ID of the course',
    type: 'number',
    required: false,
    example: 1,
  })
  course_category?: number;
}
