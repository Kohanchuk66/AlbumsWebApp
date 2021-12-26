import * as mongoose from 'mongoose';
import {Document, Model} from "mongoose";

type AlbumDocument = Document & {
    title: string;
    owner: string;
    albumId: string;
};

export const AlbumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    albumId: {
        type: String,
        required: true,
    },
});

const Album: Model<AlbumDocument> = mongoose.model<AlbumDocument>('Album', AlbumSchema);

export { Album, AlbumDocument };