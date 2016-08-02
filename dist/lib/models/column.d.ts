export default class Column {
    name: string;
    definition: string;
    value: string;
    isPrimary: boolean;
    static parseList(columns: Column[] | any): Column[];
    constructor(name: string | any, value?: string);
}
