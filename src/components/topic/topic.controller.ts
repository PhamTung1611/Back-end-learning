import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import { TopicService } from './topic.service';
  import { CreateTopicDto } from './dto/create-topic.dto';
  import { UpdateTopicDto } from './dto/update-topic.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { PermissionGuard } from '../auth/guards/permission.guard';
  import { Permissions } from '../../common/decorators/permissions.decorator';
  
  @Controller('topics')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  export class TopicController {
    constructor(
      private readonly topicService: TopicService,
    ) {}
  
    @Post()
    @Permissions('CREATE_TOPIC')
    create(
      @Body() dto: CreateTopicDto,
    ) {
      return this.topicService.create(dto);
    }
  
    @Get()
    @Permissions('VIEW_TOPIC')
    findAll() {
      return this.topicService.findAll();
    }
  
    @Get('course/:courseId')
    @Permissions('VIEW_TOPIC')
    findByCourse(
      @Param('courseId') courseId: string,
    ) {
      return this.topicService.findByCourse(
        courseId,
      );
    }
  
    @Get(':id')
    @Permissions('VIEW_TOPIC')
    findOne(
      @Param('id') id: string,
    ) {
      return this.topicService.findOne(id);
    }
  
    @Patch(':id')
    @Permissions('UPDATE_TOPIC')
    update(
      @Param('id') id: string,
      @Body() dto: UpdateTopicDto,
    ) {
      return this.topicService.update(id, dto);
    }
  
    @Delete(':id')
    @Permissions('DELETE_TOPIC')
    remove(
      @Param('id') id: string,
    ) {
      return this.topicService.remove(id);
    }
  }