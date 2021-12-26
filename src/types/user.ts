import mongoose, { Schema, Model, Document } from 'mongoose';
import {Md5} from "md5-typescript";

type UserDocument = Document & {
    email: string;
    password: string;
    login: string;
    registerDate: Date;
};

export const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    login: {
        type: String,
        required: true,
    },
    registerDate: {
        readonly: true,
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function (next) {
    try {
        if (this.isModified('userID')) {
            return next();
        }

        this.password = Md5.init(this.password);

        return next();
    } catch (e) {
        return next(e);
    }
});

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', UserSchema);

export { User, UserDocument };