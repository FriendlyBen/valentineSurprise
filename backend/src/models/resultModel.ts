import mongoose, { Schema, Document } from 'mongoose';

export interface IResult extends Document {
  username: string;
  score: number;
  timestamp: Date;
}

const ResultSchema: Schema = new Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IResult>('Result', ResultSchema);

// If you want custom name, put in 3rd argument
// export default mongoose.model<IResult>('Result', ResultSchema, 'quiz_results');
