import { CharacterStyle } from "./character-style";
import { ParagraphStyle } from "./paragraph-style";
export declare class HeadingStyle extends ParagraphStyle {
    constructor(styleId: string, name: string);
}
export declare class TitleStyle extends HeadingStyle {
    constructor();
}
export declare class Heading1Style extends HeadingStyle {
    constructor();
}
export declare class Heading2Style extends HeadingStyle {
    constructor();
}
export declare class Heading3Style extends HeadingStyle {
    constructor();
}
export declare class Heading4Style extends HeadingStyle {
    constructor();
}
export declare class Heading5Style extends HeadingStyle {
    constructor();
}
export declare class Heading6Style extends HeadingStyle {
    constructor();
}
export declare class ListParagraph extends ParagraphStyle {
    constructor();
}
export declare class FootnoteText extends ParagraphStyle {
    constructor();
}
export declare class FootnoteReferenceStyle extends CharacterStyle {
    constructor();
}
export declare class FootnoteTextChar extends CharacterStyle {
    constructor();
}
export declare class HyperlinkStyle extends CharacterStyle {
    constructor();
}
