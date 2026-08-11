import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { InjectModel } from '@nestjs/mongoose';
  
  import {
    Model,
    Types,
  } from 'mongoose';
  
  import {
    Word,
    WordDocument,
  } from '../../databases/schemas/word.schema';
  
  import {
    Topic,
    TopicDocument,
  } from '../../databases/schemas/topic.schema';
  
  import { CreateWordDto } from './dto/create-word.dto';
  import { UpdateWordDto } from './dto/update-word.dto';
  
  @Injectable()
  export class WordService {
    constructor(
      @InjectModel(Word.name)
      private readonly wordModel:
        Model<WordDocument>,
  
      @InjectModel(Topic.name)
      private readonly topicModel:
        Model<TopicDocument>,
    ) {}
  
    async create(dto: CreateWordDto) {
      const topic = await this.topicModel.findById(
        dto.topicId,
      );
  
      if (!topic) {
        throw new NotFoundException(
          'Topic không tồn tại',
        );
      }
  
      const word = await this.wordModel.create({
        ...dto,
        topicId: topic._id,
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
  
    async findByTopic(topicId: string) {
      if (!Types.ObjectId.isValid(topicId)) {
        throw new BadRequestException(
          'Topic ID không hợp lệ',
        );
      }
  
      const topic = await this.topicModel.findById(
        topicId,
      );
  
      if (!topic) {
        throw new NotFoundException(
          'Topic không tồn tại',
        );
      }
  
      const words = await this.wordModel
        .find({
          topicId,
        })
        .sort({
          order: 1,
        })
        .lean();
  
      return {
        topic: {
          id: topic._id,
          title: topic.title,
        },
        data: words,
      };
    }
  
    async findOne(id: string) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(
          'Word ID không hợp lệ',
        );
      }
  
      const word = await this.wordModel
        .findById(id)
        .populate({
          path: 'topicId',
          select: 'title description courseId',
        })
        .lean();
  
      if (!word) {
        throw new NotFoundException(
          'Word không tồn tại',
        );
      }
  
      return {
        data: word,
      };
    }
  
    async update(
      id: string,
      dto: UpdateWordDto,
    ) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(
          'Word ID không hợp lệ',
        );
      }
  
      if (dto.topicId) {
        const topic =
          await this.topicModel.findById(
            dto.topicId,
          );
  
        if (!topic) {
          throw new NotFoundException(
            'Topic không tồn tại',
          );
        }
      }
  
      const word =
        await this.wordModel.findByIdAndUpdate(
          id,
          {
            $set: dto,
          },
          {
            returnDocument: 'after',
          },
        );
  
      if (!word) {
        throw new NotFoundException(
          'Word không tồn tại',
        );
      }
  
      return {
        message: 'Cập nhật word thành công',
        data: word,
      };
    }
  
    async remove(id: string) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(
          'Word ID không hợp lệ',
        );
      }
  
      const word =
        await this.wordModel.findByIdAndDelete(id);
  
      if (!word) {
        throw new NotFoundException(
          'Word không tồn tại',
        );
      }
  
      return {
        message: 'Xóa word thành công',
      };
    }
  }