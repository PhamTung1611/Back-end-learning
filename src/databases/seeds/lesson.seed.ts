import { Model } from 'mongoose';

import {
  LessonDocument,
} from '../schemas/lesson.schema';

import {
  TopicDocument,
} from '../schemas/topic.schema';

export async function seedLessons(
  lessonModel: Model<LessonDocument>,
  topicModel: Model<TopicDocument>,
) {
  // =========================
  // TÌM TOPIC
  // =========================

  const greetingsTopic =
    await topicModel.findOne({
      title: 'Greetings',
    });

  const familyTopic =
    await topicModel.findOne({
      title: 'Family',
    });

  const foodTopic =
    await topicModel.findOne({
      title: 'Food',
    });

  if (!greetingsTopic) {
    throw new Error(
      'Topic Greetings không tồn tại',
    );
  }

  if (!familyTopic) {
    throw new Error(
      'Topic Family không tồn tại',
    );
  }

  if (!foodTopic) {
    throw new Error(
      'Topic Food không tồn tại',
    );
  }

  // =========================
  // DANH SÁCH LESSON
  // =========================

  const lessons = [
    // =========================
    // GREETINGS
    // =========================

    {
      topicId:
        greetingsTopic._id,

      title:
        'Basic Greetings',

      description:
        'Các câu chào hỏi cơ bản',

      order:
        1,

      isActive:
        true,
    },

    {
      topicId:
        greetingsTopic._id,

      title:
        'Introduce Yourself',

      description:
        'Giới thiệu bản thân',

      order:
        2,

      isActive:
        true,
    },

    // =========================
    // FAMILY
    // =========================

    {
      topicId:
        familyTopic._id,

      title:
        'Family Members',

      description:
        'Từ vựng về các thành viên trong gia đình',

      order:
        1,

      isActive:
        true,
    },

    // =========================
    // FOOD
    // =========================

    {
      topicId:
        foodTopic._id,

      title:
        'Basic Food',

      description:
        'Từ vựng cơ bản về đồ ăn và thức uống',

      order:
        1,

      isActive:
        true,
    },
  ];

  // =========================
  // UPSERT LESSONS
  // =========================

  for (const lesson of lessons) {
    await lessonModel.findOneAndUpdate(
      {
        topicId:
          lesson.topicId,

        title:
          lesson.title,
      },
      {
        $set:
          lesson,
      },
      {
        upsert:
          true,

        returnDocument:
          'after',
      },
    );
  }

  console.log(
    'Lessons seeded successfully',
  );
}