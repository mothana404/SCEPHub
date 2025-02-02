import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({
    description: 'must be at least 6 digits and not over 30 digit',
    type: 'string',
    required: true,
    example: 'myName',
  })
  user_name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'myemail55@gmail.com',
  })
  user_email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  @ApiProperty({
    description:
      'the password of the user from 8 to 25 character and it should be strong password',
    type: 'string',
    required: true,
    example: 'MyPassword1234@',
  })
  password: string;

  @IsString({ message: 'Phone number must be a number' })
  @ApiProperty({
    description: 'the number of the user and should be a 10 digits',
    type: 'number',
    required: true,
    example: '0770077000',
  })
  phone_number: number;

  @IsString({ message: 'the major must be a string' })
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'software engineering',
  })
  major: string;

  @IsString({ message: 'the company name must be a string' })
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'lorem company',
  })
  company_name: string;
}
