const activeDocument: typeof app.activeDocument;
const photoshop: {
    quit(): void;
};

const executeAction: typeof app.executeAction;
const executeActionGet: typeof app.executeActionGet;

const charIDToTypeID: typeof app.charIDToTypeID;
const stringIDToTypeID: typeof app.stringIDToTypeID;
const typeIDToStringID: typeof app.typeIDToStringID;
const typeIDToCharID: typeof app.typeIDToCharID;

/**
 * 同步执行 shell 命令
 */
function system(command: string): number;

interface Document {
    layers: Array<LayerSet & ArtLayer>;
}

interface LayerSet {
    layers: Array<LayerSet & ArtLayer>;
}

interface ActionDescriptor {
    count: number;
}

interface ActionList {
    count: number;
}
