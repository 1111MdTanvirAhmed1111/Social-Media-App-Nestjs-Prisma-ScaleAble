import { IsString, IsNotEmpty, IsOptional, IsObject, IsDefined } from 'class-validator';

// Define the shape of the Pdata object
class PostData {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;  // Image URL is optional
}

export class CreatePostDto {
  @IsObject()
  @IsDefined()
  Pdata: PostData;

  @IsOptional()
  @IsString()
  file: string;
}

export class UpdatePostDto {
  @IsObject()
  @IsDefined()
  Pdata: PostData;

  @IsOptional()
  @IsString()
  file: string;
}
