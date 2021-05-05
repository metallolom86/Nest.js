import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class emailDto {
  @ApiProperty()
  public email: string;

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
  public email: string;
}