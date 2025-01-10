import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class StudentFormDto {
  @ApiProperty({
    description: 'Array of strings representing skills',
    type: [String],
    required: false,
    example: ['JavaScript', 'Node.js', 'React'],
  })
  @IsOptional()
  @IsArray({ message: 'skills must be an array of strings' })
  skills?: string;

  @ApiProperty({
    description: 'Name of the university',
    type: 'string',
    required: false,
    example: 'Hashemite University',
  })
  @IsOptional()
  @IsString({ message: 'university_name must be a string' })
  university_name?: string;

  @ApiProperty({
    description: 'phone number',
    type: 'string',
    required: false,
    example: '0777716328',
  })
  @IsOptional()
  @IsString({ message: 'phone_number must be a string' })
  phone_number?: string;

  @ApiProperty({
    description: 'user_name',
    type: 'string',
    required: false,
    example: 'this name',
  })
  @IsString({ message: 'user_name must be a string' })
  user_name?: string;

  @ApiProperty({
    description: 'Student major',
    type: 'string',
    required: false,
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString({ message: 'major must be a string' })
  major?: string;

  @ApiProperty({
    description: 'About me section',
    type: 'string',
    required: false,
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @IsOptional()
  @IsString({ message: 'about_me must be a string' })
  about_me?: string;

  @ApiProperty({
    description: 'Joined projects (array of project IDs)',
    type: [Number],
    required: false,
    example: [2, 3, 4, 5, 6],
  })
  @IsOptional()
  @IsArray({ message: 'joined_projects must be an array of numbers' })
  joined_projects?: number[];

  @ApiProperty({
    description: 'User links (e.g., GitHub, LinkedIn)',
    type: [Object],
    required: false,
    example: [
      { link_name: 'GitHub', link: 'https://github.com/username' },
      { link_name: 'LinkedIn', link: 'https://linkedin.com/in/username' },
    ],
  })
  @IsOptional()
  @IsArray({ message: 'user_link must be an array of objects' })
  links?: string;
}
