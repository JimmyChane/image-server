import { LocalFileModule } from '@app/local-file/local-file.module';
import { Module } from '@nestjs/common';
import { ImageListService } from './image-list.service';
import { ImageStreamService } from './image-stream.service';
import { ImageService } from './image.service';

@Module({
  imports: [LocalFileModule],
  providers: [ImageService, ImageListService, ImageStreamService],
  exports: [ImageService, ImageListService, ImageStreamService],
})
export class ImageModule {}
