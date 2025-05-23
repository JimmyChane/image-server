import { LocalFileModule } from '@app/local-file';
import { Module } from '@nestjs/common';
import { ImageService } from './image.service';

@Module({ imports: [LocalFileModule], providers: [ImageService], exports: [ImageService] })
export class ImageModule {}
