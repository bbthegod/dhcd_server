import { Model, Schema, model } from 'mongoose';

interface FileModel extends Model<File> {
  List(filter: { limit: number; skip: number; filter: object; sort: string }): any;
}

const fileSchema = new Schema<File, FileModel>(
  {
    filename: { type: String },
    url: { type: String },
  },
  { collection: 'files', timestamps: true },
);

fileSchema.statics.List = async function ({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
  const data = await this.find(filter, { createdAt: 0, updatedAt: 0, password: 0 })
    .sort(sort)
    .skip(+skip)
    .limit(+limit)
    .exec();
  const count = await this.find(filter).count();
  return { data, count, limit, skip };
};

export default model('File', fileSchema);
