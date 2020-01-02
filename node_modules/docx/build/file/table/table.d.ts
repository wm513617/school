import { XmlComponent } from "../../file/xml-components";
import { TableCell, WidthType } from "./table-cell";
import { TableColumn } from "./table-column";
import { ITableFloatOptions } from "./table-properties";
import { TableRow } from "./table-row";
export interface ITableOptions {
    readonly rows: number;
    readonly columns: number;
    readonly width?: number;
    readonly widthUnitType?: WidthType;
    readonly columnWidths?: number[];
    readonly margins?: {
        readonly marginUnitType?: WidthType;
        readonly top?: number;
        readonly bottom?: number;
        readonly right?: number;
        readonly left?: number;
    };
    readonly float?: ITableFloatOptions;
}
export declare class Table extends XmlComponent {
    private readonly properties;
    private readonly rows;
    constructor({ rows, columns, width, widthUnitType, columnWidths, margins: { marginUnitType, top, bottom, right, left }, float, }: ITableOptions);
    getRow(index: number): TableRow;
    getColumn(index: number): TableColumn;
    getCell(row: number, col: number): TableCell;
    setFixedWidthLayout(): Table;
}
