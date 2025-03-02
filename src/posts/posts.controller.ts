import { Controller, Post, Body, Put,Delete,Param, Get, Query, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express'; 

import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';


const storage = diskStorage({
    destination: './uploads/blogs/images', // The directory to store the file
    filename: (req, file, callback) => {
      const fileName = Date.now() + extname(file.originalname); // Generates a unique file name
      callback(null, fileName); // Save the file with the new name
    }
  });


@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) {}

    @Get()
    getPosts( @Query('limit') limit){



      return this.postService.getPosts(limit)
    }


    @Get(':id')
    GetPostSingle(@Param('id') id){
      return this.postService.getPostSingle(id)
    }

 
 // Create a new post
 @Post()
 @UseInterceptors(FileInterceptor('file',{storage})) // This handles file uploads
 async createPost(@Body() body, @UploadedFile() file: Express.Multer.File) {
   if (!body.Pdata) {
     throw new BadRequestException('Please provide post data');
   }
   return this.postService.createPost(body.Pdata, file);
 }

 // Update a post
 @Put(':id')
 @UseInterceptors(FileInterceptor('file')) // This handles file uploads
 async updatePost(
   @Param('id') id: string,
   @Body() body,
   @UploadedFile() file: Express.Multer.File,
 ) {
   if (!body.Pdata) {
     throw new BadRequestException('Please provide post data');
   }
   return this.postService.updatePost(id, body.Pdata, file);
 }

 // Delete a post
 @Delete(':id')
 async deletePost(@Param('id') id: string) {
   return this.postService.deletePost(id);
 }


}
