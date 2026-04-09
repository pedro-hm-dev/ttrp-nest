import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class InvitePlayerDto {
  @ApiProperty({ example: 'player@example.com' })
  @IsEmail()
  email!: string;
}
