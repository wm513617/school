import { XmlAttributeComponent, XmlComponent } from "../../../file/xml-components";
export declare class TabStop extends XmlComponent {
    constructor(tab: TabStopItem);
}
export declare enum TabValue {
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center",
    BAR = "bar",
    CLEAR = "clear",
    DECIMAL = "decimal",
    END = "end",
    NUM = "num",
    START = "start"
}
export declare enum LeaderType {
    DOT = "dot",
    HYPHEN = "hyphen",
    MIDDLE_DOT = "middleDot",
    NONE = "none",
    UNDERSCORE = "underscore"
}
export declare class TabAttributes extends XmlAttributeComponent<{
    readonly val: TabValue;
    readonly pos: string | number;
    readonly leader?: LeaderType;
}> {
    protected readonly xmlKeys: {
        val: string;
        pos: string;
        leader: string;
    };
}
export declare class TabStopItem extends XmlComponent {
    constructor(value: TabValue, position: string | number, leader?: LeaderType);
}
export declare class MaxRightTabStop extends TabStop {
    constructor(leader?: LeaderType);
}
export declare class LeftTabStop extends TabStop {
    constructor(position: number, leader?: LeaderType);
}
export declare class RightTabStop extends TabStop {
    constructor(position: number, leader?: LeaderType);
}
export declare class CenterTabStop extends TabStop {
    constructor(position: number, leader?: LeaderType);
}
