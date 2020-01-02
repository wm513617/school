import { InitializableXmlComponent, XmlComponent } from "../../file/xml-components";
import { Paragraph } from "../paragraph";
import { Table } from "../table";
export declare class Footer extends InitializableXmlComponent {
    private readonly refId;
    constructor(referenceNumber: number, initContent?: XmlComponent);
    readonly ReferenceId: number;
    addParagraph(paragraph: Paragraph): Footer;
    createParagraph(text?: string): Paragraph;
    addTable(table: Table): void;
    createTable(rows: number, cols: number): Table;
}
