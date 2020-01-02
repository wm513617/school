import { ImageParagraph, PictureRun } from "../paragraph";
export declare class Image {
    private readonly paragraph;
    constructor(paragraph: ImageParagraph);
    readonly Paragraph: ImageParagraph;
    readonly Run: PictureRun;
    scale(factorX: number, factorY?: number): void;
}
