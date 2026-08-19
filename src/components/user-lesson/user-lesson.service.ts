import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import {
  UserLesson,
  UserLessonDocument,
  UserLessonStatus,
} from '../../databases/schemas/user-lesson.schema';

import { Lesson, LessonDocument } from '../../databases/schemas/lesson.schema';

import { UpdateUserLessonProgressDto } from './dto/update-user-lesson-progress.dto';

import { Topic, TopicDocument } from '../../databases/schemas/topic.schema';

import {
  UserCourse,
  UserCourseDocument,
  UserCourseStatus,
} from '../../databases/schemas/userCourse.schema';
@Injectable()
export class UserLessonService {
  constructor(
    @InjectModel(UserLesson.name)
    private readonly userLessonModel: Model<UserLessonDocument>,

    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>,

    @InjectModel(Topic.name)
    private readonly topicModel: Model<TopicDocument>,

    @InjectModel(UserCourse.name)
    private readonly userCourseModel: Model<UserCourseDocument>,
  ) {}

  // ==========================================
  // BẮT ĐẦU HỌC LESSON
  // ==========================================

  async startLesson(userId: string, lessonId: string) {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(lessonId)) {
      throw new BadRequestException('User ID hoặc Lesson ID không hợp lệ');
    }

    // 1. Kiểm tra lesson tồn tại
    const lesson = await this.lessonModel.findById(lessonId);

    if (!lesson) {
      throw new NotFoundException('Lesson không tồn tại');
    }

    // 2. Kiểm tra user đã bắt đầu lesson chưa
    const existed = await this.userLessonModel.findOne({
      userId,
      lessonId,
    });

    if (existed) {
      throw new ConflictException('Bạn đã bắt đầu lesson này rồi');
    }

    const now = new Date();

    // 3. Tạo UserLesson
    const userLesson = await this.userLessonModel.create({
      userId,
      lessonId,

      status: UserLessonStatus.LEARNING,

      progress: 0,

      startedAt: now,

      completedAt: null,

      lastAccessedAt: now,
    });

    return {
      message: 'Bắt đầu lesson thành công',

      data: userLesson,
    };
  }

  // ==========================================
  // LẤY TẤT CẢ LESSON CỦA USER
  // ==========================================

  async findMyLessons(userId: string) {
    return await this.userLessonModel
      .find({
        userId,
      })
      .populate('lessonId')
      .sort({
        updatedAt: -1,
      })
      .lean();
  }

  // ==========================================
  // LẤY TRẠNG THÁI 1 LESSON
  // ==========================================

  async findOne(userId: string, lessonId: string) {
    if (!Types.ObjectId.isValid(lessonId)) {
      throw new BadRequestException('Lesson ID không hợp lệ');
    }

    const userLesson = await this.userLessonModel
      .findOne({
        userId,
        lessonId,
      })
      .populate('lessonId')
      .lean();

    if (!userLesson) {
      throw new NotFoundException('Bạn chưa bắt đầu lesson này');
    }

    return userLesson;
  }

  // ==========================================
  // CẬP NHẬT PROGRESS LESSON
  // ==========================================

  async updateProgress(
    userId: string,
    lessonId: string,
    dto: UpdateUserLessonProgressDto,
  ) {
    if (!Types.ObjectId.isValid(lessonId)) {
      throw new BadRequestException('Lesson ID không hợp lệ');
    }

    const userLesson = await this.userLessonModel.findOne({
      userId,
      lessonId,
    });

    if (!userLesson) {
      throw new NotFoundException('Bạn chưa bắt đầu lesson này');
    }

    userLesson.progress = dto.progress;

    userLesson.lastAccessedAt = new Date();

    // Nếu progress > 0 thì đang học
    if (dto.progress > 0 && dto.progress < 100) {
      userLesson.status = UserLessonStatus.LEARNING;
    }

    // Nếu đạt 100 thì hoàn thành
    if (dto.progress === 100) {
      userLesson.status = UserLessonStatus.COMPLETED;

      userLesson.completedAt = new Date();
    }

    await userLesson.save();

    await this.updateCourseProgress(userId, lessonId);

    return {
      message: 'Cập nhật tiến độ thành công',

      data: userLesson,
    };
  }

  // ==========================================
  // HOÀN THÀNH LESSON
  // ==========================================

  async completeLesson(userId: string, lessonId: string) {
    if (!Types.ObjectId.isValid(lessonId)) {
      throw new BadRequestException('Lesson ID không hợp lệ');
    }

    const userLesson = await this.userLessonModel.findOne({
      userId,
      lessonId,
    });

    if (!userLesson) {
      throw new NotFoundException('Bạn chưa bắt đầu lesson này');
    }

    if (userLesson.status === UserLessonStatus.COMPLETED) {
      throw new ConflictException('Lesson này đã hoàn thành rồi');
    }

    userLesson.progress = 100;

    userLesson.status = UserLessonStatus.COMPLETED;

    userLesson.completedAt = new Date();

    userLesson.lastAccessedAt = new Date();

    await userLesson.save();

    await this.updateCourseProgress(userId, lessonId);

    return {
      message: 'Hoàn thành lesson thành công',

      data: userLesson,
    };
  }

  private async updateCourseProgress(userId: string, lessonId: string) {
    // 1. TÌM LESSON HIỆN TẠI
    const lesson = await this.lessonModel.findById(lessonId);

    if (!lesson) {
      throw new NotFoundException('Lesson không tồn tại');
    }
    // 2. TÌM TOPIC
    const topic = await this.topicModel.findById(lesson.topicId);

    if (!topic) {
      throw new NotFoundException('Topic không tồn tại');
    }

    const userObjectId = new Types.ObjectId(userId.toString());

    const courseObjectId = new Types.ObjectId(topic.courseId.toString());

    // 3. TÌM USER COURSE

    const userCourse = await this.userCourseModel.findOne({
      userId: userObjectId,
      courseId: courseObjectId,
    });

    if (!userCourse) {
      throw new NotFoundException('User chưa tham gia course này');
    }

    // =====================================
    // 4. LẤY TẤT CẢ TOPIC CỦA COURSE
    // =====================================

    const topics = await this.topicModel
      .find({
        courseId: courseObjectId,
      })
      .select('_id')
      .lean();

    const topicIds = topics.map((topic) => topic._id);

    console.log('TOPICS TRONG COURSE:', topicIds);

    // =====================================
    // 5. LẤY TẤT CẢ LESSON CỦA COURSE
    // =====================================

    const lessons = await this.lessonModel
      .find({
        topicId: {
          $in: topicIds,
        },
      })
      .select('_id')
      .lean();

    const lessonIds = lessons.map((lesson) => lesson._id);

    console.log('LESSONS TRONG COURSE:', lessonIds);

    const totalLessons = lessonIds.length;

    console.log('TOTAL LESSONS:', totalLessons);

    if (totalLessons === 0) {
      throw new BadRequestException('Course chưa có lesson nào');
    }

    // =====================================
    // 6. ĐẾM LESSON USER ĐÃ HOÀN THÀNH
    // =====================================

    const completedLessons = await this.userLessonModel.countDocuments({
      userId: userObjectId,

      lessonId: {
        $in: lessonIds,
      },

      status: UserLessonStatus.COMPLETED,
    });

    console.log('COMPLETED LESSONS:', completedLessons);

    // =====================================
    // 7. TÍNH PROGRESS
    // =====================================

    const progress = Math.round((completedLessons / totalLessons) * 100);

    console.log('COURSE PROGRESS:', progress);

    // =====================================
    // 8. UPDATE USER COURSE
    // =====================================

    const now = new Date();

    userCourse.progress = progress;

    userCourse.lastAccessedAt = now;

    if (progress === 100) {
      userCourse.status = UserCourseStatus.COMPLETED;

      userCourse.completedAt = now;

      if (!userCourse.startedAt) {
        userCourse.startedAt = now;
      }
    } else if (progress > 0) {
      userCourse.status = UserCourseStatus.LEARNING;

      userCourse.completedAt = null;

      if (!userCourse.startedAt) {
        userCourse.startedAt = now;
      }
    } else {
      userCourse.status = UserCourseStatus.NOT_STARTED;

      userCourse.completedAt = null;
    }

    await userCourse.save();

    console.log('USER COURSE SAU UPDATE:', {
      progress: userCourse.progress,

      status: userCourse.status,

      startedAt: userCourse.startedAt,

      completedAt: userCourse.completedAt,
    });
  }
}
