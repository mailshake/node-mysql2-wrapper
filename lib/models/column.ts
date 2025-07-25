export default class Column {
  name: string;
  definition: string;
  value: string;
  isPrimary: boolean;

  static parseList(columns: Column[]|any): Column[] {
    if (Array.isArray(columns)) {
      return columns;
    }

    let result: Column[] = [];
    Object.keys(columns).forEach((name) => {
      let data = columns[name];
      if (typeof(data) === 'undefined') {
        data = null;
      }
      let args;
      if (typeof (data) === 'string' ||
        typeof (data) === 'number' ||
        typeof (data) === 'boolean' ||
        data instanceof RegExp ||
        data === null ||
        data instanceof Date) {
        args = {
          name: name,
          value: data
        };
      }
      else {
        args = data;
        args.name = name;
      }
      result.push(new Column(args));
    });
    return result;
  }

  constructor(name: string | any, value?: string) {
    if (typeof (name) === 'string') {
      this.name = name;
    }
    else {
      Object.keys(name).forEach((key) => {
        this[key] = name[key];
      });
    }
    if (value) {
      this.value = value;
    }
  }
}
