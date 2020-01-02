import { XmlComponent } from "../../../file/xml-components";
export declare class Border extends XmlComponent {
    constructor();
    addTopBorder(color?: string, space?: string, value?: string, size?: string): XmlComponent;
    addBottomBorder(color?: string, space?: string, value?: string, size?: string): XmlComponent;
    addLeftBorder(color?: string, space?: string, value?: string, size?: string): XmlComponent;
    addRightBorder(color?: string, space?: string, value?: string, size?: string): XmlComponent;
}
export declare class ThematicBreak extends XmlComponent {
    constructor();
}
