import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateContactUsDto {
  @IsNotEmpty({ message: 'the name must at least 3 digits' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'ali',
  })
  contact_name: string;

  @IsNotEmpty({ message: 'real email!' })
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'ali@gmail.com',
  })
  contact_email: string;

  @IsNotEmpty({ message: 'contain a real phone number!' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: '07111111111',
  })
  contact_phoneNumber: string;

  @IsNotEmpty({ message: 'contain a message!' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'lorem lorem lorem lorem',
  })
  contact_message: string;
}
