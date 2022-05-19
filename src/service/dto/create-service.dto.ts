import { IsString, IsDate } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly price: number;

  @IsString()
  readonly duration: number;

  @IsString()
  readonly category: number;
}
