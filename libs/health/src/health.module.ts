import { Module } from '@nestjs/common';
import { HeatlhController } from './health.controller';

@Module({ controllers: [HeatlhController] })
export class HealthModule {}
