import { XmlComponent } from "../../file/xml-components";
export interface IPropertiesOptions {
    readonly title?: string;
    readonly subject?: string;
    readonly creator?: string;
    readonly keywords?: string;
    readonly description?: string;
    readonly lastModifiedBy?: string;
    readonly revision?: string;
    readonly externalStyles?: string;
}
export declare class CoreProperties extends XmlComponent {
    constructor(options: IPropertiesOptions);
}
