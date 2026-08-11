import { Model } from 'mongoose';

import {
  CourseDocument,
} from '../schemas/course.schema';

import {
  LanguageDocument,
} from '../schemas/language.schema';

export const seedCourses = async (
  courseModel: Model<CourseDocument>,
  languageModel: Model<LanguageDocument>,
) => {
  // Tìm English được seed trước đó
  const english = await languageModel.findOne({
    code: 'en',
  });

  if (!english) {
    throw new Error(
      'Không tìm thấy Language English. Hãy seed Language trước.',
    );
  }

  const courses = [
    {
      title: 'English A1',
      description: 'Tiếng Anh cơ bản dành cho người mới bắt đầu',
      languageId: english._id,
      level: 'A1',
      order: 1,
      isActive: true,
    },
    {
      title: 'English A2',
      description: 'Tiếng Anh trình độ sơ cấp',
      languageId: english._id,
      level: 'A2',
      order: 2,
      isActive: true,
    },
  ];

  for (const course of courses) {
    await courseModel.findOneAndUpdate(
      {
        title: course.title,
        languageId: english._id,
      },
      {
        $set: course,
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  console.log('Courses seeded successfully');
};