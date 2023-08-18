export interface iIncomeComandInterface {
    ACT: Array<string> | null;
    DATE: Array<string> | null;
    TIME: Array<string> | null;
    TASK: Array<string> | null;
    PER: Array<string> | null;
    LEMMACT: Array<string> | null;
    LEMMDATE: Array<string> | null;
    LEMMTIME: Array<string> | null;
    LEMMTASK: Array<string> | null;
    LEMMPER: Array<string> | null;
    CREATE: Array<string> | null;
    PREFIX: Array<string> | null;
    LEMMPREFIX: Array<string> | null;
}

export interface iIncomeCreateTasksCommand {
    ACT: Array<string>;
    DATE: Array<string> | null;
    TIME: Array<string> | null;
    TASK: Array<string>;
    PER: Array<string> | null;
    LEMMACT: Array<string>;
    LEMMDATE: Array<string> | null;
    LEMMTIME: Array<string> | null;
    LEMMTASK: Array<string>;
    LEMMPER: Array<string> | null;
    CREATE: Array<string> | null;
    PREFIX: Array<string> | null;
    LEMMPREFIX: Array<string> | null;
}

export interface iIncomeUpdateTasksCommand {
    ACT: Array<string>;
    DATE: Array<string> ;
    TIME: Array<string> ;
    TASK: Array<string>;
    PER: Array<string> ;
    LEMMACT: Array<string>;
    LEMMDATE: Array<string> ;
    LEMMTIME: Array<string> ;
    LEMMTASK: Array<string>;
    LEMMPER: Array<string> ;
    PREFIX: Array<string> | null;
    CREATE: Array<string> | null;
    LEMMPREFIX: Array<string> | null;
}



export interface iTask {
    id: number;
    description: string;
}

export interface iData {
    id: number;
    name: string;
    person: string;
    date: string;
    time: string;
    lemmaName: string;
    lemmaPerson: string;
    lemmaDate: string;
    lemmaTime: string;
    tasks: iTask[]; // Массив объектов Task
    createdAt: string;
    updatedAt: string;
}
