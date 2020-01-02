import { XmlComponent } from "../../file/xml-components";
import { ISpacingProperties } from "../paragraph/formatting";
export declare enum LevelSuffix {
    NOTHING = "nothing",
    SPACE = "space",
    TAB = "tab"
}
export declare class LevelBase extends XmlComponent {
    private readonly paragraphProperties;
    private readonly runProperties;
    constructor(level: number, start?: number, numberFormat?: string, levelText?: string, lvlJc?: string);
    setSuffix(value: LevelSuffix): LevelBase;
    addParagraphProperty(property: XmlComponent): Level;
    addRunProperty(property: XmlComponent): Level;
    size(twips: number): Level;
    bold(): Level;
    italics(): Level;
    smallCaps(): Level;
    allCaps(): Level;
    strike(): Level;
    doubleStrike(): Level;
    subScript(): Level;
    superScript(): Level;
    underline(underlineType?: string, color?: string): Level;
    color(color: string): Level;
    font(fontName: string): Level;
    center(): Level;
    left(): Level;
    right(): Level;
    justified(): Level;
    thematicBreak(): Level;
    maxRightTabStop(): Level;
    leftTabStop(position: number): Level;
    indent(attrs: object): Level;
    spacing(params: ISpacingProperties): Level;
    keepNext(): Level;
    keepLines(): Level;
}
export declare class Level extends LevelBase {
    constructor(level: number, numberFormat: string, levelText: string, lvlJc: string);
}
export declare class LevelForOverride extends LevelBase {
}
