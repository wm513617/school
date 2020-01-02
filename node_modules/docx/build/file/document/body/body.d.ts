import { IXmlableObject, XmlComponent } from "../../../file/xml-components";
import { Paragraph, TableOfContents } from "../..";
import { SectionProperties, SectionPropertiesOptions } from "./section-properties/section-properties";
export declare class Body extends XmlComponent {
    private readonly defaultSection;
    private readonly sections;
    constructor(sectionPropertiesOptions?: SectionPropertiesOptions);
    addSection(section: SectionPropertiesOptions | SectionProperties): void;
    prepForXml(): IXmlableObject | undefined;
    push(component: XmlComponent): void;
    readonly DefaultSection: SectionProperties;
    getTablesOfContents(): TableOfContents[];
    getParagraphs(): Paragraph[];
    private createSectionParagraph;
}
