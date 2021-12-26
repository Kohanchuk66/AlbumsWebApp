import * as mongoose from 'mongoose';
import {Document, Model} from "mongoose";

type PhotoDocument = Document & {
    albumId: string;
    title: string;
    url: string;
    thumbnailUrl: string;
    owner: string;
};


export const PhotoSchema = new mongoose.Schema({
    albumId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
});

const Photo: Model<PhotoDocument> = mongoose.model<PhotoDocument>('Photo', PhotoSchema);

export { Photo, PhotoDocument };