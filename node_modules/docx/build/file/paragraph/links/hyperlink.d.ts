import { XmlComponent } from "../../../file/xml-components";
import { TextRun } from "../run";
export declare class Hyperlink extends XmlComponent {
    readonly linkId: number;
    private readonly textRun;
    constructor(text: string, relationshipsCount: number, anchor?: string);
    readonly TextRun: TextRun;
}
