import { Model } from 'mongoose';

import {
  CourseDocument,
} from '../schemas/course.schema';

import {
  TopicDocument,
} from '../schemas/topic.schema';

export const seedTopics = async (
  topicModel: Model<TopicDocument>,
  courseModel: Model<CourseDocument>,
) => {

  const englishA1 = await courseModel.findOne({
    title: 'English A1',
  });

  const englishA2 = await courseModel.findOne({
    title: 'English A2',
  });

  if (!englishA1) {
    throw new Error(
      'Không tìm thấy English A1. Hãy seed Course trước.',
    );
  }

  if (!englishA2) {
    throw new Error(
      'Không tìm thấy English A2. Hãy seed Course trước.',
    );
  }

  const topicsA1 = [
    {
      title: 'Greetings',
      description: 'Chào hỏi và giới thiệu bản thân',
      courseId: englishA1._id,
      order: 1,
      isActive: true,
    },
    {
      title: 'Family',
      description: 'Gia đình và các thành viên trong gia đình',
      courseId: englishA1._id,
      order: 2,
      isActive: true,
    },
    {
      title: 'Food',
      description: 'Đồ ăn và thức uống cơ bản',
      courseId: englishA1._id,
      order: 3,
      isActive: true,
    },
    {
      title: 'Daily Activities',
      description: 'Các hoạt động thường ngày',
      courseId: englishA1._id,
      order: 4,
      isActive: true,
    },
  ];


  const topicsA2 = [
    {
      title: 'Travel',
      description: 'Du lịch và phương tiện đi lại',
      courseId: englishA2._id,
      order: 1,
      isActive: true,
    },
    {
      title: 'Shopping',
      description: 'Mua sắm và giao tiếp khi mua hàng',
      courseId: englishA2._id,
      order: 2,
      isActive: true,
    },
    {
      title: 'Health',
      description: 'Sức khỏe và các tình huống cơ bản',
      courseId: englishA2._id,
      order: 3,
      isActive: true,
    },
  ];

  const topics = [
    ...topicsA1,
    ...topicsA2,
  ];


  for (const topic of topics) {
    await topicModel.findOneAndUpdate(
      {
        title: topic.title,
        courseId: topic.courseId,
      },
      {
        $set: topic,
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  console.log('Topics seeded successfully');
};