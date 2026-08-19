import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { Topic, TopicDocument } from '../../databases/schemas/topic.schema';

import { Course, CourseDocument } from '../../databases/schemas/course.schema';

import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name)
    private readonly topicModel: Model<TopicDocument>,

    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async create(dto: CreateTopicDto) {
    const course = await this.courseModel.findById(dto.courseId);

    if (!course) {
      throw new NotFoundException('Course không tồn tại');
    }

    return this.topicModel.create({
      ...dto,
      courseId: course._id,
    });
  }

  async findAll() {
    return this.topicModel
      .find()
      .populate({
        path: 'courseId',
        select: 'title level',
      })
      .sort({
        order: 1,
      })
      .lean();
  }

  async findByCourse(courseId: string) {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException('Course ID không hợp lệ');
    }

    const topics = await this.topicModel
      .find({
        courseId: new Types.ObjectId(courseId),
      })
      .sort({
        order: 1,
      })
      .lean();

    return topics;
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Topic ID không hợp lệ');
    }

    const topic = await this.topicModel
      .findById(id)
      .populate({
        path: 'courseId',
        select: 'title level',
      })
      .lean();

    if (!topic) {
      throw new NotFoundException('Topic không tồn tại');
    }

    return topic;
  }

  async update(id: string, dto: UpdateTopicDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Topic ID không hợp lệ');
    }

    if (dto.courseId) {
      const course = await this.courseModel.findById(dto.courseId);

      if (!course) {
        throw new NotFoundException('Course không tồn tại');
      }
    }

    const topic = await this.topicModel.findByIdAndUpdate(
      id,
      {
        $set: dto,
      },
      {
        new: true,
      },
    );

    if (!topic) {
      throw new NotFoundException('Topic không tồn tại');
    }

    return topic;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Topic ID không hợp lệ');
    }

    const topic = await this.topicModel.findByIdAndDelete(id);

    if (!topic) {
      throw new NotFoundException('Topic không tồn tại');
    }

    return {
      message: 'Xóa topic thành công',
    };
  }
}
