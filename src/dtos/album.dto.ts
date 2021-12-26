import { IsNotEmpty } from "class-validator";

export class DeleteAlbumDTO {
    @IsNotEmpty()
    albumId: string;
}

export class ChangeAlbumTitleDTO {
    @IsNotEmpty()
    albumId: string;
    @IsNotEmpty()
    new_album_name: string;
}