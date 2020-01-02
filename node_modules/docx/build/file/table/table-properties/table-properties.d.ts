import { IgnoreIfEmptyXmlComponent } from "../../../file/xml-components";
import { ITableShadingAttributesProperties } from "../shading";
import { WidthType } from "../table-cell";
import { TableCellMargin } from "./table-cell-margin";
import { ITableFloatOptions } from "./table-float-properties";
export declare class TableProperties extends IgnoreIfEmptyXmlComponent {
    private readonly cellMargin;
    constructor();
    setWidth(width: number, type?: WidthType): TableProperties;
    setFixedWidthLayout(): TableProperties;
    setBorder(): TableProperties;
    readonly CellMargin: TableCellMargin;
    setTableFloatProperties(tableFloatOptions: ITableFloatOptions): TableProperties;
    setShading(attrs: ITableShadingAttributesProperties): TableProperties;
}
