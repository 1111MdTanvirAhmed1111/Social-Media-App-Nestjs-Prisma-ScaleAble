// src/file.service.ts
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private readonly directoryPath = path.join(__dirname, 'files'); // The directory to store the files

  constructor() {
    // Ensure the directory exists
    fs.mkdir(this.directoryPath, { recursive: true });
  }




  // Update a file (overwrite content)
  async updateFile(filename: string, content: string): Promise<string> {
    const filePath = path.join(this.directoryPath, filename);
    await fs.writeFile(filePath, content, 'utf-8');
    return filename;
  }

  // Delete a file
  async deleteFile(filename: string): Promise<string> {

    const dir = __dirname.slice(0,__dirname.length -11)

    await fs.unlink(filename);
    return filename;
  }
}
