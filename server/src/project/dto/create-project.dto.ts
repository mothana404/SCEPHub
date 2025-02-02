import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'video title is required' })
  @IsString({ message: 'video title must be a string' })
  @MinLength(6, { message: 'video title must be at least 6 characters long' })
  @MaxLength(20, {
    message: 'video title must be less than or equal to 20 characters long',
  })
  @ApiProperty({
    description: 'the title of the project',
    type: 'string',
    required: true,
    example: 'car renting application',
  })
  project_name: string;

  @IsString({ message: 'project description must be a string' })
  @ApiProperty({
    description: 'this is a react native app for car renting',
    type: 'string',
    required: true,
  })
  project_description: string;

  @IsNotEmpty({ message: 'project category required' })
  @ApiProperty({
    description: 'comes from the same backend api',
    type: 'number',
    required: true,
    example: '1',
  })
  project_category: number;

  @ApiProperty({
    type: 'date',
    required: false,
    example: '2025/2/7',
  })
  start_date: Date;

  @IsNotEmpty({ message: 'end date required' })
  @ApiProperty({
    type: 'date',
    required: false,
    example: '2025/4/7',
  })
  end_date: Date;

  @IsArray({ message: 'required_skills must be an array of strings' })
  @IsString({ each: true, message: 'each skill must be a string' })
  @ApiProperty({
    description: 'list of skills required to join the project',
    type: [String],
    required: false,
    example: ['React Native', 'Node.js', 'UI Design'],
  })
  required_skills: string[];
}
