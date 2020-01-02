import { BaseXmlComponent } from "./base";
import { IXmlableObject } from "./xmlable-object";
export { BaseXmlComponent };
export declare const EMPTY_OBJECT: {};
export declare abstract class XmlComponent extends BaseXmlComponent {
    protected root: Array<BaseXmlComponent | string>;
    constructor(rootKey: string);
    prepForXml(): IXmlableObject | undefined;
    addChildElement(child: XmlComponent | string): XmlComponent;
    delete(): void;
}
export declare abstract class IgnoreIfEmptyXmlComponent extends XmlComponent {
    prepForXml(): IXmlableObject | undefined;
}
