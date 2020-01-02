import { TableCell } from "./table-cell";
export declare class TableColumn {
    private readonly cells;
    constructor(cells: TableCell[]);
    getCell(index: number): TableCell;
    mergeCells(startIndex: number, endIndex: number): TableCell;
}
