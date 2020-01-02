/// <reference types="node" />
import { File } from "../../file";
export declare class Packer {
    private readonly compiler;
    constructor(prettifyXml?: boolean);
    toBuffer(file: File): Promise<Buffer>;
    toBase64String(file: File): Promise<string>;
    toBlob(file: File): Promise<Blob>;
}
