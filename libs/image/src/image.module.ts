import { LocalFileModule } from '@app/local-file/local-file.module';
import { Module } from '@nestjs/common';
import { ImageDimensionService } from './image-dimension.service';
import { ImageFormatService } from './image-format.service';
import { ImageListService } from './image-list.service';
import { ImageStreamService } from './image-stream.service';
import { ImageService } from './image.service';

@Module({
  imports: [LocalFileModule],
  providers: [ImageService, ImageDimensionService, ImageFormatService, ImageListService, ImageStreamService],
  exports: [ImageListService, ImageStreamService],
})
export class ImageModule {}
