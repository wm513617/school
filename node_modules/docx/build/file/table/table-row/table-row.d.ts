import { HeightRule } from "../../../file/table/table-row/table-row-height";
import { XmlComponent } from "../../../file/xml-components";
import { TableCell } from "../table-cell";
export declare class TableRow extends XmlComponent {
    private readonly cells;
    private readonly properties;
    constructor(cells: TableCell[]);
    getCell(index: number): TableCell;
    addGridSpan(index: number, cellSpan: number): TableCell;
    mergeCells(startIndex: number, endIndex: number): TableCell;
    setCantSplit(): TableRow;
    setTableHeader(): TableRow;
    setHeight(height: number, rule: HeightRule): TableRow;
}
