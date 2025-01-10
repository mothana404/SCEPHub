import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class EmailDto {
  @IsNotEmpty({ message: 'Sender email is required' })
  @IsEmail({}, { message: 'Invalid email format for sender' })
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The email address of the sender',
    example: 'mothana@example.com',
  })
  from: string;

  @IsNotEmpty({ message: 'Receiver email is required' })
  @IsEmail({}, { message: 'Invalid email format for receiver' })
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The email address of the receiver',
    example: 'receiver@example.com',
  })
  receiver: string;

  @IsNotEmpty({ message: 'Subject is required' })
  @IsString({ message: 'Subject must be a string' })
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The subject of the email',
    example: 'Welcome to Our Platform',
  })
  subject: string;

  @IsNotEmpty({ message: 'HTML content is required' })
  @IsString({ message: 'HTML content must be a string' })
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The HTML content of the email body',
    example: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
  })
  html: string;

  @IsNotEmpty({ message: 'Message body is required' })
  @IsString({ message: 'Message body must be a string' })
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The plain text message body of the email',
    example: 'Welcome to our platform! Thank you for registering.',
  })
  message: string;

  @IsOptional()
  @IsString({ message: 'Placeholder must be a string' })
  @ApiProperty({
    type: 'string',
    required: false,
    description:
      'A placeholder value that could be used in the email content (e.g., for dynamic data)',
    example: 'John Doe',
  })
  placeholder?: string;
}
