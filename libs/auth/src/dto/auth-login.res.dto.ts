import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginResDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey',
    type: 'string',
    required: true,
  })
  access_token!: string;
}
