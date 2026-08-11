import { Model } from 'mongoose';

import {
  Language,
  LanguageDocument,
} from '../schemas/language.schema';

export const seedLanguages = async (
  languageModel: Model<LanguageDocument>,
) => {
  const languages = [
    {
      name: 'English',
      code: 'en',
      nativeName: 'English',
      isActive: true,
    },
  ];

  for (const language of languages) {
    await languageModel.findOneAndUpdate(
      {
        code: language.code,
      },
      {
        $set: language,
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  console.log('Languages seeded successfully');
};