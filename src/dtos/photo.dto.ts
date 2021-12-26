import { IsNotEmpty } from "class-validator";

export class GetPhotosDTO {
    ownerId: string;
    page: number;
    maxCount: number;
}

export class DeletePhotoDTO {
    @IsNotEmpty()
    photoId: string;
}