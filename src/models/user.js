import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    avatarUrl: {
      type: String,
      default: null,
    },
    savedStories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Story',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
