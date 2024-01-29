import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: { type: String, require: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false, required: true, trim: true },
    age: { type: Number, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    is_admin: { type: Boolean, select: false, default: false, trim: true },
}, { timestamps: true });

export default mongoose.model('users', schema);
