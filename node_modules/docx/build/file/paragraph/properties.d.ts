import { IgnoreIfEmptyXmlComponent, XmlComponent } from "../../file/xml-components";
import { Border } from "./formatting/border";
export declare class ParagraphProperties extends IgnoreIfEmptyXmlComponent {
    readonly paragraphBorder: Border;
    constructor();
    createBorder(): void;
    push(item: XmlComponent): void;
}
