import { BaseXmlComponent, XmlComponent } from "../../file/xml-components";
import { DocumentDefaults } from "./defaults";
import { CharacterStyle, ParagraphStyle } from "./style";
export * from "./border";
export declare class Styles extends XmlComponent {
    constructor(initialStyles?: BaseXmlComponent);
    push(style: XmlComponent): Styles;
    createDocumentDefaults(): DocumentDefaults;
    createParagraphStyle(styleId: string, name?: string): ParagraphStyle;
    createCharacterStyle(styleId: string, name?: string): CharacterStyle;
}
