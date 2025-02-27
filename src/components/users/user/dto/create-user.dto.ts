import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsNumber,
  Matches,
  IsArray,
  ArrayUnique,
  IsString,
  IsDateString,
  Length,
  IsObject,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Name of user', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email of user', example: 'johndoegmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Role of user', example: ['admin'] })
  @IsOptional()
  @IsString()
  role: string;

  @ApiProperty({ description: 'password of user', example: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
