import { LocalFileModule } from '@app/local-file/local-file.module';
import { Module } from '@nestjs/common';
import { ImageDimensionService } from './image-dimension.service';
import { ImageFormatService } from './image-format.service';
import { ImageListService } from './image-list.service';
import { ImageStreamService } from './image-stream.service';

@Module({
  imports: [LocalFileModule],
  providers: [ImageListService, ImageStreamService, ImageDimensionService, ImageFormatService],
  exports: [ImageListService, ImageStreamService],
})
export class ImageModule {}
