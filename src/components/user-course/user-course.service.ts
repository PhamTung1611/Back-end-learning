import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import {
  UserCourse,
  UserCourseDocument,
  UserCourseStatus,
} from '../../databases/schemas/userCourse.schema';

import { Course, CourseDocument } from '../../databases/schemas/course.schema';

@Injectable()
export class UserCourseService {
  constructor(
    @InjectModel(UserCourse.name)
    private readonly userCourseModel: Model<UserCourseDocument>,

    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async enroll(userId: string, courseId: string) {
    const userObjectId = new Types.ObjectId(userId.toString());

    const courseObjectId = new Types.ObjectId(courseId.toString());

    const course = await this.courseModel.findById(courseObjectId);

    if (!course) {
      throw new NotFoundException('Course không tồn tại');
    }

    const existed = await this.userCourseModel.findOne({
      userId: userObjectId,
      courseId: courseObjectId,
    });

    if (existed) {
      throw new ConflictException('Bạn đã tham gia course này rồi');
    }

    const userCourse = await this.userCourseModel.create({
      userId: userObjectId,
      courseId: courseObjectId,
      progress: 0,
      status: UserCourseStatus.NOT_STARTED,
      startedAt: null,
      completedAt: null,
      lastAccessedAt: null,
    });

    return {
      message: 'Đăng ký course thành công',
      data: userCourse,
    };
  }

  async findMyCourses(userId: string) {
    return this.userCourseModel
      .find({
        userId,
      })
      .populate('courseId')
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  async findOne(userId: string, courseId: string) {
    const userCourse = await this.userCourseModel
      .findOne({
        userId,
        courseId,
      })
      .populate('courseId')
      .lean();

    if (!userCourse) {
      throw new NotFoundException('User chưa tham gia course này');
    }

    return userCourse;
  }
}
