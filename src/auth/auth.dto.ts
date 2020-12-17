import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty()
  public login: string;

  @ApiProperty()
  public password: string;
}

export class JWT_Token {
  @ApiPropertyOptional()
  public access_token: string
}

export class ProfileDto {
  @ApiPropertyOptional()
  public _id: string;

  @ApiPropertyOptional()
  public login: string;
}