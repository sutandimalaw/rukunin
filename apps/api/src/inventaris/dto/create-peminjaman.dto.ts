import { IsString, IsInt, Min, IsDateString } from 'class-validator';

export class CreatePeminjamanDto {
  @IsString()
  inventarisId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsDateString()
  borrowDate: string;

  @IsDateString()
  returnDate: string;

  @IsString()
  purpose: string;
}
