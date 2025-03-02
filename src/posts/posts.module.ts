import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // Import the PrismaModule
import { FileService } from 'src/file/file.service';

@Module({
  imports:[PrismaModule],
  providers: [PostsService,FileService],
  controllers: [PostsController]
})
export class PostsModule {}
