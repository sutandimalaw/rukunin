import { IsIn, IsOptional, IsString } from 'class-validator';

export class RespondSaranMasukanDto {
  @IsIn(['DIBACA', 'DITANGGAPI'])
  status: string;

  @IsOptional()
  @IsString()
  adminResponse?: string;
}
