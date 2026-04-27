import { IsOptional, IsString } from 'class-validator';

export class QueryKontakDaruratDto {
  @IsOptional()
  @IsString()
  category?: string;
}
