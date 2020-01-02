import { IDrawingOptions } from "../drawing";
import { IMediaData } from "../media";
import { Paragraph } from "./paragraph";
import { PictureRun } from "./run";
export declare class ImageParagraph extends Paragraph {
    private readonly pictureRun;
    constructor(imageData: IMediaData, drawingOptions?: IDrawingOptions);
    scale(factorX: number, factorY?: number): void;
    readonly Run: PictureRun;
}
