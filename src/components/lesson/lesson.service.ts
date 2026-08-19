import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { Lesson, LessonDocument } from '../../databases/schemas/lesson.schema';

import { Topic, TopicDocument } from '../../databases/schemas/topic.schema';

import { CreateLessonDto } from './dto/create-lesson.dto';

import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>,

    @InjectModel(Topic.name)
    private readonly topicModel: Model<TopicDocument>,
  ) {}

  async create(dto: CreateLessonDto) {
    if (!Types.ObjectId.isValid(dto.topicId)) {
      throw new BadRequestException('Topic ID không hợp lệ');
    }

    const topic = await this.topicModel.findById(dto.topicId);

    if (!topic) {
      throw new NotFoundException('Topic không tồn tại');
    }

    const lesson = await this.lessonModel.create({
      ...dto,
      topicId: topic._id,
    });

    return {
      message: 'Tạo lesson thành công',
      data: lesson,
    };
  }

  async findAll() {
    return this.lessonModel
      .find()
      .sort({
        order: 1,
      })
      .lean();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Lesson ID không hợp lệ');
    }

    const lesson = await this.lessonModel.findById(id).lean();

    if (!lesson) {
      throw new NotFoundException('Lesson không tồn tại');
    }

    return lesson;
  }

  async findByTopic(topicId: string) {
    console.log('topicId:', topicId);
    if (!Types.ObjectId.isValid(topicId)) {
      throw new BadRequestException('Topic ID không hợp lệ');
    }

    const topic = await this.topicModel.findById(topicId);

    if (!topic) {
      throw new NotFoundException('Topic không tồn tại');
    }

    return this.lessonModel
      .find({
        topicId,
        isActive: true,
      })
      .sort({
        order: 1,
      })
      .lean();
  }

  async update(id: string, dto: UpdateLessonDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Lesson ID không hợp lệ');
    }

    if (dto.topicId && !Types.ObjectId.isValid(dto.topicId)) {
      throw new BadRequestException('Topic ID không hợp lệ');
    }

    if (dto.topicId) {
      const topic = await this.topicModel.findById(dto.topicId);

      if (!topic) {
        throw new NotFoundException('Topic không tồn tại');
      }
    }

    const lesson = await this.lessonModel.findByIdAndUpdate(
      id,
      {
        $set: dto,
      },
      {
        returnDocument: 'after',
      },
    );

    if (!lesson) {
      throw new NotFoundException('Lesson không tồn tại');
    }

    return {
      message: 'Cập nhật lesson thành công',
      data: lesson,
    };
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Lesson ID không hợp lệ');
    }

    const lesson = await this.lessonModel.findByIdAndDelete(id);

    if (!lesson) {
      throw new NotFoundException('Lesson không tồn tại');
    }

    return {
      message: 'Xóa lesson thành công',
    };
  }
}
