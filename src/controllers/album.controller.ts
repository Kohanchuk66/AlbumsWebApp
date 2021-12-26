import {
    Body,
    Controller,
    HttpCode,
    Res,
    UseBefore,
    Delete,
    Put
} from "routing-controllers";
import express from "express";

import { checkAuth } from "../middleware/authorize.middleware";
import { Album } from "../types/album";
import { ChangeAlbumTitleDTO, DeleteAlbumDTO } from "../dtos/album.dto";

@Controller()
export class AlbumController {
    @Delete('/delete-album')
    @UseBefore(checkAuth)
    @HttpCode(200)
    async deleteAlbum(@Body() deleteAlbumDTO: DeleteAlbumDTO, @Res() res: express.Response) {
        try {
            const albumsIds = deleteAlbumDTO.albumId.split(',');

            const album = await Album.findOne({albumId: { $in: albumsIds } });
            if (!album)
                return res.status(404).json({
                    message: 'Album not found!'
                });

            await Album.deleteMany({albumId: { $in: albumsIds } });

            return { message: "Album delete successfully!" };
        }
        catch (e){
            return res.status(500).json({
                message: 'Something went wrong!'
            });
        }
    }

    @Put('/change-album-title')
    @UseBefore(checkAuth)
    @HttpCode(200)
    async updateAlbum(@Body() changeAlbumTitleDTO: ChangeAlbumTitleDTO, @Res() res: express.Response) {
        try {
            const { albumId, new_album_name } = changeAlbumTitleDTO;

            const album = await Album.findOne({ albumId });
            if (!album)
                return res.status(404).json({
                    message: 'Album not found!'
                });

            await Album.updateOne({ albumId }, {title: new_album_name});

            return { message: "Album updated successfully!" };
        }
        catch (e){
            return res.status(500).json({
                message: 'Something went wrong!'
            });
        }
    }
}