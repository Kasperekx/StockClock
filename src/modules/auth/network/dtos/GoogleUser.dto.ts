import { ApiProperty } from '@nestjs/swagger';

export class GoogleUserDTO {
  @ApiProperty()
  email: string;
  @ApiProperty()
  displayName: string;
}
