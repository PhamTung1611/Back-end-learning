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
    Course,
    CourseDocument,
  } from '../../databases/schemas/course.schema';
  
  import {
    Language,
    LanguageDocument,
  } from '../../databases/schemas/language.schema';
  
  import {
    CreateCourseDto,
  } from './dto/create-course.dto';
  
  import {
    UpdateCourseDto,
  } from './dto/update-course.dto';
  
  @Injectable()
  export class CourseService {
    constructor(
      @InjectModel(Course.name)
      private readonly courseModel:
        Model<CourseDocument>,
  
      @InjectModel(Language.name)
      private readonly languageModel:
        Model<LanguageDocument>,
    ) {}
  
    async create(dto: CreateCourseDto) {
        const language = await this.languageModel.findOne({
          code: dto.languageCode,
        });
      
        if (!language) {
          throw new NotFoundException(
            `Không tìm thấy language ${dto.languageCode}`,
          );
        }
      
        const course = await this.courseModel.create({
          title: dto.title,
          description: dto.description,
      
          // backend tự nối
          languageId: language._id,
      
          level: dto.level,
          thumbnail: dto.thumbnail,
          order: dto.order ?? 0,
          isActive: dto.isActive ?? true,
        });
      
        return course;
      }
  
    async findAll() {
      return this.courseModel
        .find()
        .populate({
          path: 'languageId',
          select: 'name code nativeName',
        })
        .sort({
          order: 1,
        })
        .lean();
    }
  
    async findOne(id: string) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(
          'Course ID không hợp lệ',
        );
      }
  
      const course =
        await this.courseModel
          .findById(id)
          .populate({
            path: 'languageId',
            select: 'name code nativeName',
          })
          .lean();
  
      if (!course) {
        throw new NotFoundException(
          'Course không tồn tại',
        );
      }
  
      return course;
    }
  
    async update(
      id: string,
      dto: UpdateCourseDto,
    ) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(
          'Course ID không hợp lệ',
        );
      }
  
      if (dto.languageId) {
        const language =
          await this.languageModel.findById(
            dto.languageId,
          );
  
        if (!language) {
          throw new NotFoundException(
            'Language không tồn tại',
          );
        }
      }
  
      const course =
        await this.courseModel
          .findByIdAndUpdate(
            id,
            {
              $set: dto,
            },
            {
              new: true,
            },
          )
          .populate({
            path: 'languageId',
            select: 'name code nativeName',
          });
  
      if (!course) {
        throw new NotFoundException(
          'Course không tồn tại',
        );
      }
  
      return course;
    }
  
    async remove(id: string) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(
          'Course ID không hợp lệ',
        );
      }
  
      const course =
        await this.courseModel.findByIdAndDelete(
          id,
        );
  
      if (!course) {
        throw new NotFoundException(
          'Course không tồn tại',
        );
      }
  
      return {
        message: 'Xóa course thành công',
      };
    }
  }