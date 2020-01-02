import { XmlComponent } from "../../../file/xml-components";
import { TextRun } from "../run";
export declare class Bookmark {
    readonly linkId: number;
    readonly start: BookmarkStart;
    readonly text: TextRun;
    readonly end: BookmarkEnd;
    constructor(name: string, text: string, relationshipsCount: number);
}
export declare class BookmarkStart extends XmlComponent {
    readonly linkId: number;
    constructor(name: string, relationshipsCount: number);
}
export declare class BookmarkEnd extends XmlComponent {
    readonly linkId: number;
    constructor(relationshipsCount: number);
}
