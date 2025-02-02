import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateContentDto {
  @IsNotEmpty({ message: 'video title is required' })
  @IsString({ message: 'video title must be a string' })
  @MinLength(6, { message: 'video title must be at least 6 characters long' })
  @MaxLength(20, {
    message: 'video title must be less than or equal to 20 characters long',
  })
  @ApiProperty({
    description: 'this is the title for one section',
    type: 'string',
    required: true,
    example: 'DOM JS and BOM',
  })
  video_title: string;

  @IsString({ message: 'Course description must be a string' })
  @ApiProperty({
    description:
      'video_description must be at least 6 characters and not over 30 characters',
    type: 'string',
    required: true,
    example: 'This is the video title description for more details',
  })
  video_description: string;

  @IsNotEmpty({ message: 'course id required' })
  @ApiProperty({
    description: 'This value is from the query',
    type: 'number',
    required: true,
    example: '1',
  })
  course_id: number;
}
