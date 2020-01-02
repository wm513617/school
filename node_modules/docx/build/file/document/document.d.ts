import { XmlComponent } from "../../file/xml-components";
import { Paragraph } from "../paragraph";
import { ITableOptions, Table } from "../table";
import { TableOfContents } from "../table-of-contents";
import { Body } from "./body";
import { SectionPropertiesOptions } from "./body/section-properties";
export declare class Document extends XmlComponent {
    private readonly body;
    constructor(sectionPropertiesOptions?: SectionPropertiesOptions);
    addParagraph(paragraph: Paragraph): Document;
    addTableOfContents(toc: TableOfContents): Document;
    createParagraph(text?: string): Paragraph;
    addTable(table: Table): Document;
    createTable(options: ITableOptions): Table;
    readonly Body: Body;
    getTablesOfContents(): TableOfContents[];
    getParagraphs(): Paragraph[];
}
