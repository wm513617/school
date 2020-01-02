import { XmlComponent } from "../../../file/xml-components";
import { Style } from "./style";
export declare class CharacterStyle extends Style {
    private readonly runProperties;
    constructor(styleId: string, name?: string);
    basedOn(parentId: string): CharacterStyle;
    addRunProperty(property: XmlComponent): CharacterStyle;
    color(color: string): CharacterStyle;
    bold(): CharacterStyle;
    italics(): CharacterStyle;
    underline(underlineType?: string, color?: string): CharacterStyle;
    superScript(): CharacterStyle;
    size(twips: number): CharacterStyle;
    link(link: string): CharacterStyle;
    semiHidden(): CharacterStyle;
}
