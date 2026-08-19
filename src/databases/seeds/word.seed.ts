import { Model } from 'mongoose';

import {
  WordDocument,
} from '../schemas/word.schema';

import {
  LessonDocument,
} from '../schemas/lesson.schema';

export const seedWords = async (
  wordModel: Model<WordDocument>,
  lessonModel: Model<LessonDocument>,
) => {
  // =========================
  // TÌM LESSON
  // =========================

  const basicGreetings =
    await lessonModel.findOne({
      title: 'Basic Greetings',
    });

  const familyMembers =
    await lessonModel.findOne({
      title: 'Family Members',
    });

  const basicFood =
    await lessonModel.findOne({
      title: 'Basic Food',
    });

  if (!basicGreetings) {
    throw new Error(
      'Không tìm thấy Lesson Basic Greetings',
    );
  }

  if (!familyMembers) {
    throw new Error(
      'Không tìm thấy Lesson Family Members',
    );
  }

  if (!basicFood) {
    throw new Error(
      'Không tìm thấy Lesson Basic Food',
    );
  }

  const words = [
    // =========================
    // BASIC GREETINGS
    // =========================

    {
      term: 'hello',
      meaning: 'xin chào',
      pronunciation: '/həˈləʊ/',
      pronunciationType: 'IPA',
      partOfSpeech: 'interjection',
      example: 'Hello, my name is Tung.',
      exampleMeaning:
        'Xin chào, tôi tên là Tùng.',
      lessonId: basicGreetings._id,
      order: 1,
      isActive: true,
    },

    {
      term: 'hi',
      meaning: 'chào',
      pronunciation: '/haɪ/',
      pronunciationType: 'IPA',
      partOfSpeech: 'interjection',
      example: 'Hi, how are you?',
      exampleMeaning:
        'Chào, bạn khỏe không?',
      lessonId: basicGreetings._id,
      order: 2,
      isActive: true,
    },

    {
      term: 'goodbye',
      meaning: 'tạm biệt',
      pronunciation: '/ˌɡʊdˈbaɪ/',
      pronunciationType: 'IPA',
      partOfSpeech: 'interjection',
      example: 'Goodbye, see you tomorrow.',
      exampleMeaning:
        'Tạm biệt, hẹn gặp bạn ngày mai.',
      lessonId: basicGreetings._id,
      order: 3,
      isActive: true,
    },

    {
      term: 'thanks',
      meaning: 'cảm ơn',
      pronunciation: '/θæŋks/',
      pronunciationType: 'IPA',
      partOfSpeech: 'interjection',
      example: 'Thanks for your help.',
      exampleMeaning:
        'Cảm ơn vì sự giúp đỡ của bạn.',
      lessonId: basicGreetings._id,
      order: 4,
      isActive: true,
    },

    {
      term: 'welcome',
      meaning: 'chào mừng',
      pronunciation: '/ˈwel.kəm/',
      pronunciationType: 'IPA',
      partOfSpeech: 'interjection',
      example: 'Welcome to our class.',
      exampleMeaning:
        'Chào mừng đến với lớp học của chúng tôi.',
      lessonId: basicGreetings._id,
      order: 5,
      isActive: true,
    },

    // =========================
    // FAMILY MEMBERS
    // =========================

    {
      term: 'father',
      meaning: 'bố / cha',
      pronunciation: '/ˈfɑː.ðər/',
      pronunciationType: 'IPA',
      partOfSpeech: 'noun',
      example: 'My father is a teacher.',
      exampleMeaning:
        'Bố tôi là giáo viên.',
      lessonId: familyMembers._id,
      order: 1,
      isActive: true,
    },

    {
      term: 'mother',
      meaning: 'mẹ',
      pronunciation: '/ˈmʌð.ər/',
      pronunciationType: 'IPA',
      partOfSpeech: 'noun',
      example: 'My mother is at home.',
      exampleMeaning:
        'Mẹ tôi đang ở nhà.',
      lessonId: familyMembers._id,
      order: 2,
      isActive: true,
    },

    {
      term: 'brother',
      meaning: 'anh/em trai',
      pronunciation: '/ˈbrʌð.ər/',
      pronunciationType: 'IPA',
      partOfSpeech: 'noun',
      example: 'I have one brother.',
      exampleMeaning:
        'Tôi có một người anh/em trai.',
      lessonId: familyMembers._id,
      order: 3,
      isActive: true,
    },

    {
      term: 'sister',
      meaning: 'chị/em gái',
      pronunciation: '/ˈsɪs.tər/',
      pronunciationType: 'IPA',
      partOfSpeech: 'noun',
      example: 'My sister is a student.',
      exampleMeaning:
        'Chị/em gái tôi là học sinh.',
      lessonId: familyMembers._id,
      order: 4,
      isActive: true,
    },

    // =========================
    // BASIC FOOD
    // =========================

    {
      term: 'rice',
      meaning: 'cơm / gạo',
      pronunciation: '/raɪs/',
      pronunciationType: 'IPA',
      partOfSpeech: 'noun',
      example: 'I eat rice every day.',
      exampleMeaning:
        'Tôi ăn cơm mỗi ngày.',
      lessonId: basicFood._id,
      order: 1,
      isActive: true,
    },

    {
      term: 'water',
      meaning: 'nước',
      pronunciation: '/ˈwɔː.tər/',
      pronunciationType: 'IPA',
      partOfSpeech: 'noun',
      example: 'I drink water.',
      exampleMeaning:
        'Tôi uống nước.',
      lessonId: basicFood._id,
      order: 2,
      isActive: true,
    },
  ];

  for (const word of words) {
    await wordModel.findOneAndUpdate(
      {
        term: word.term,
        lessonId: word.lessonId,
      },
      {
        $set: word,
      },
      {
        upsert: true,
        returnDocument: 'after',
      },
    );
  }

  console.log(
    'Words seeded successfully',
  );
};