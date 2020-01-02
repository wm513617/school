import { XmlAttributeComponent, XmlComponent } from "../../../file/xml-components";
export declare enum AlignmentOptions {
    START = "start",
    END = "end",
    CENTER = "center",
    BOTH = "both",
    DISTRIBUTE = "distribute",
    LEFT = "left",
    RIGHT = "right"
}
export declare class AlignmentAttributes extends XmlAttributeComponent<{
    readonly val: AlignmentOptions;
}> {
    protected readonly xmlKeys: {
        val: string;
    };
}
export declare class Alignment extends XmlComponent {
    constructor(type: AlignmentOptions);
}
