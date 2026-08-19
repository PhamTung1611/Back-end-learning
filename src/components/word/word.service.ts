import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { Word, WordDocument } from '../../databases/schemas/word.schema';

import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Lesson, LessonDocument } from 'src/databases/schemas/lesson.schema';

@Injectable()
export class WordService {
  constructor(
    @InjectModel(Word.name)
    private readonly wordModel: Model<WordDocument>,

    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>,
  ) {}

  async create(dto: CreateWordDto) {
    // 1. Kiểm tra Lesson có tồn tại không
    const lesson = await this.lessonModel.findById(dto.lessonId);

    if (!lesson) {
      throw new NotFoundException('Lesson không tồn tại');
    }

    // 2. Tạo Word và liên kết với Lesson
    const word = await this.wordModel.create({
      ...dto,
      lessonId: lesson._id,
    });

    return {
      message: 'Tạo word thành công',
      data: word,
    };
  }

  async findAll() {
    const words = await this.wordModel
      .find()
      .populate({
        path: 'topicId',
        select: 'title description courseId',
      })
      .sort({
        order: 1,
      })
      .lean();

    return {
      data: words,
    };
  }

  async findByLesson(lessonId: string) {
    if (!Types.ObjectId.isValid(lessonId)) {
      throw new BadRequestException('Lesson ID không hợp lệ');
    }

    const lesson = await this.lessonModel.findById(lessonId);

    if (!lesson) {
      throw new NotFoundException('Lesson không tồn tại');
    }

    return this.wordModel
      .find({
        lessonId: lesson._id,
        isActive: true,
      })
      .sort({
        order: 1,
      })
      .lean();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Word ID không hợp lệ');
    }

    const word = await this.wordModel
      .findById(id)
      .populate({
        path: 'topicId',
        select: 'title description courseId',
      })
      .lean();

    if (!word) {
      throw new NotFoundException('Word không tồn tại');
    }

    return {
      data: word,
    };
  }

  async update(id: string, dto: UpdateWordDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Word ID không hợp lệ');
    }

    if (dto.lessonId) {
      const topic = await this.lessonModel.findById(dto.lessonId);

      if (!topic) {
        throw new NotFoundException('Topic không tồn tại');
      }
    }

    const word = await this.wordModel.findByIdAndUpdate(
      id,
      {
        $set: dto,
      },
      {
        returnDocument: 'after',
      },
    );

    if (!word) {
      throw new NotFoundException('Word không tồn tại');
    }

    return {
      message: 'Cập nhật word thành công',
      data: word,
    };
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Word ID không hợp lệ');
    }

    const word = await this.wordModel.findByIdAndDelete(id);

    if (!word) {
      throw new NotFoundException('Word không tồn tại');
    }

    return {
      message: 'Xóa word thành công',
    };
  }
}
