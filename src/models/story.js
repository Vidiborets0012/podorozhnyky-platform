// import { Schema, model } from 'mongoose';

// const storySchema = new Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 150,
//     },
//     description: {
//       type: String,
//       required: true,
//       maxlength: 10000,
//     },
//     imageUrl: {
//       type: String,
//       required: true,
//     },
//     category: {
//       type: Schema.Types.ObjectId,
//       ref: 'Category',
//       required: true,
//     },
//     owner: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   },
// );

// export const Story = model('Story', storySchema);

import { Schema, model } from 'mongoose';

const storySchema = new Schema(
  {
    img: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    article: {
      type: String,
      required: true,
      maxlength: 10000,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Story = model('Story', storySchema);
