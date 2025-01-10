import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SignInDto {
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
}
