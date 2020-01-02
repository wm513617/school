import { IXmlableObject } from "./xmlable-object";
export declare abstract class BaseXmlComponent {
    protected readonly rootKey: string;
    protected deleted: boolean;
    constructor(rootKey: string);
    abstract prepForXml(): IXmlableObject | undefined;
    readonly IsDeleted: boolean;
}
