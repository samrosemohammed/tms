import {
  IsString,
  IsOptional,
  IsIn,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Description cannot exceed 200 characters' })
  description?: string;

  @IsString()
  @IsIn(['Todo', 'In Progress', 'Done'])
  status: string;

  @IsString()
  @IsIn(['Low', 'Medium', 'High'])
  priority: string;
}
