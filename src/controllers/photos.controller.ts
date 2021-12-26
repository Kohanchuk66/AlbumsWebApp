import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Res,
    UseBefore,
    Req,
    Delete,
    Params
} from "routing-controllers";
import express from "express";

import {checkAuth} from "../middleware/authorize.middleware";
import {DeletePhotoDTO, GetPhotosDTO} from "../dtos/photo.dto";
import {Photo} from "../types/photo";
import axios from "axios";
import {Album} from "../types/album";

@Controller()
export class PhotosController {
    @Post('/load-photos')
    @UseBefore(checkAuth)
    @HttpCode(200)
    async loadPhotos(@Req() req: express.Request, @Res() res: express.Response) {
        try {
            const photos = await axios
                .get(
                    `http://jsonplaceholder.typicode.com/photos`
                )
                .then(async (response) => {
                    return response.data ? response.data : [];
                });

            for (const el of photos) {
                el.owner = req.headers['id'];
                const photo = new Photo(el);
                await photo.save();
                const album = await Album.findOne({ albumId: el.albumId }).lean();
                if (!album){
                    const albumsCount = await Album.count();
                    const album = new Album({
                        owner: req.headers['id'],
                        title: albumsCount + 1,
                        albumId: el.albumId.toString()
                    });
                    await album.save();
                }
            }

            return { message: "Photos add successfully!" };
        }
        catch (e){
            return res.status(500).json({
                message: 'Something went wrong!'
            });
        }

    }
    @Get('/get-photos')
    @HttpCode(200)
    async getPhotos(@Params() getPhotosDTO: GetPhotosDTO, @Res() res: express.Response) {
        try {
            const { ownerId, page, maxCount } = getPhotosDTO;
            let params = {};
            const offset = page ? (page - 1) * maxCount : 0;
            const limit = maxCount || 10;

            if (ownerId)
                params['owner'] = ownerId;

            return Photo.find(params).skip(offset).limit(limit).lean();
        }
        catch (e){
            return res.status(500).json({
                message: 'Something went wrong!'
            });
        }

    }

    @Delete('/delete-photo')
    @UseBefore(checkAuth)
    @HttpCode(200)
    async deletePhoto(@Body() deletePhotoDTO: DeletePhotoDTO, @Res() res: express.Response) {
        try {
            const photoIds = deletePhotoDTO.photoId.split(',');

            const photo = await Photo.findOne({_id: { $in: photoIds } });
            if (!photo)
                return res.status(400).json({
                    message: 'Photo not found!'
                });

            await Photo.deleteMany({_id: { $in: photoIds } });

            return { message: "Photo delete successfully!" };
        }
        catch (e){
            return res.status(500).json({
                message: 'Something went wrong!'
            });
        }

    }
}