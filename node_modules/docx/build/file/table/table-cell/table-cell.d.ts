import { Paragraph } from "../../../file/paragraph";
import { IXmlableObject, XmlComponent } from "../../../file/xml-components";
import { ITableShadingAttributesProperties } from "../shading";
import { Table } from "../table";
import { ITableCellMarginOptions } from "./cell-margin/table-cell-margins";
import { TableCellBorders, VerticalAlign, VMergeType } from "./table-cell-components";
import { TableCellProperties } from "./table-cell-properties";
export declare class TableCell extends XmlComponent {
    private readonly properties;
    constructor();
    addParagraph(content: Paragraph): TableCell;
    addTable(content: Table): TableCell;
    prepForXml(): IXmlableObject | undefined;
    createParagraph(text?: string): Paragraph;
    setVerticalAlign(type: VerticalAlign): TableCell;
    addGridSpan(cellSpan: number): TableCell;
    addVerticalMerge(type: VMergeType): TableCell;
    setMargins(margins: ITableCellMarginOptions): TableCell;
    setShading(attrs: ITableShadingAttributesProperties): TableCell;
    readonly Borders: TableCellBorders;
    readonly Properties: TableCellProperties;
}
