import bcrypt from 'bcrypt';
import { Model, Schema, model } from 'mongoose';

interface UserModel extends Model<User> {
  List(filter: { limit: number; skip: number; filter: object; sort: string }): any;
  Login(user: User, password: string): boolean;
}

const UserSchema = new Schema<User, UserModel>(
  {
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'delegate', 'admin'], default: 'user' },
    isCheckin: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    survey: { type: Array },
    status: { type: Number, default: 0 },
  },
  { collection: 'users', timestamps: true },
);

UserSchema.pre('save', function (next) {
  if (this.role !== 'admin') return next();
  const rounds = 10;
  if (!this.isModified('password')) return next();
  return bcrypt.hash(this.password, rounds, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    return next();
  });
});

UserSchema.statics.List = async function ({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
  const data = await this.find(filter, { createdAt: 0, updatedAt: 0, password: 0, __v: 0 })
    .sort(sort)
    .skip(+skip)
    .limit(+limit)
    .exec();
  const count = await this.find(filter).count();
  return { data, count, limit, skip };
};

UserSchema.statics.Login = async function (user, password) {
  console.log(await bcrypt.compare(password, user.password));
  return await bcrypt.compare(password, user.password);
};

export default model('User', UserSchema);
