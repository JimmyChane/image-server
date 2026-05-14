import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginResDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey', type: 'string', required: true })
  loginToken!: string;
}

export class AuthAccessResDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey', type: 'string', required: true })
  accessToken!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey', type: 'string', required: true })
  refreshToken!: string;
}
