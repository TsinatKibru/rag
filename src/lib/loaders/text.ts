import { Document } from "@langchain/core/documents";
import { BaseDocumentLoader } from "@langchain/core/document_loaders/base";
import { readFile } from "fs/promises";

/**
 * A simple TextLoader that reads a file from the filesystem and returns it as a Document.
 * Implements the BaseDocumentLoader interface from @langchain/core.
 */
export class TextLoader extends BaseDocumentLoader {
    constructor(public filePath: string) {
        super();
    }

    async load(): Promise<Document[]> {
        const text = await readFile(this.filePath, "utf-8");
        const metadata = { source: this.filePath };
        return [new Document({ pageContent: text, metadata })];
    }
}
