import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';
import { FileService } from 'src/file/file.service';


@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService, private fileService: FileService) {}

    
async getPosts( limit?: number) {
        try {
          // If an id is provided, fetch a specific post

            // If no id is provided, fetch all posts with the optional limit
            const posts = await this.prisma.post.findMany({
              take: limit || undefined, // Limit the number of posts if a limit is passed
            });
    
            return posts; // Return all posts
          
        } catch (error) {
          throw new Error(error.message || 'Internal Server Error');
        }
      }


async getPostSingle(id?: number){
try{
  const post = await this.prisma.post.findUnique({
    where: { id },
  });

  // If post not found, throw an error
  

  return post; // Return the specific post
  }catch(err){
    return {
      "messege":  'Post Not Found',
      "statusCode": 404,
    }
}



}




// Create a new post
async createPost(Pdata: string, file: Express.Multer.File) {
  if (!Pdata) {
    throw new BadRequestException('Please Provide Details');
  }

  const { title, content, author, category } = JSON.parse(Pdata);
  
  const imageUrl = file ? `/uploads/blogs/images/${file.filename}` : 'null';

  try {
    const post = await this.prisma.post.create({
      data: {
        title,
        content,
        author,
        category,
        imageUrl,
      },
    });

    // Emit new post event to clients (You can use websockets for this)
    return post;
  } catch (error) {
    if (file) {
      fs.unlinkSync(file.path); // Clean up uploaded file if error occurs
    }
    throw error;
  }
}

// Update a post
async updatePost(id: string, Pdata: string, file: Express.Multer.File) {
  if (!Pdata) {
    throw new BadRequestException('Please Provide Details');
  }

  try {
    const post = await this.prisma.post.findUnique({
      where: { id: Number(id) },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const { title, content, author, category } = JSON.parse(Pdata);
    let imageUrl = post.imageUrl;

    if (file) {
      // Remove old image
      if (post.imageUrl && post.imageUrl !== 'null') {
        const oldImagePath = path.join(__dirname, '..', post.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `./uploads/blogs/images/${file.filename}`;
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        author,
        category,
        imageUrl,
      },
    });
    
    if (file) {
      fs.unlink(file.path, (err) => {
        if (err) {
            // Handle the error if there is one
            console.error('Error deleting the file:', err);
        } else {
            // Successfully deleted the file
            console.log('File deleted successfully');
        }
    });
    }
    return updatedPost;
  } catch (error) {
   
    throw error;
  }
}

// Delete a post
async deletePost(id: string) {
  try {
    const post = await this.prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Delete image
    if (post.imageUrl && post.imageUrl !== 'null') {
      const imagePath = path.join(__dirname, '..', post.imageUrl.replace('.', ''));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the post
    await this.prisma.post.delete({
      where: { id: Number(id) },
    });

    if(post.imageUrl){

const dir = __dirname.slice(0,__dirname.length -11)

  this.fileService.deleteFile(dir+post.imageUrl)
    }

    return { message: 'Post deleted successfully', post };
  } catch (error) {
    throw error;
  }
}



}