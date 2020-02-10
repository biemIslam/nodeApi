import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    code: { type: Number, required: true },
    quoteImage: {type: String, required: true}
});

export default mongoose.model('Courses', courseSchema);