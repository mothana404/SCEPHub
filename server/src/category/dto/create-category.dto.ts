import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({
    description: 'based on programming language or a IT field',
    type: 'string',
    required: true,
    example: 'software engineering',
  })
  category_name: string;
}
