import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateKomentarDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  isi: string;
}
