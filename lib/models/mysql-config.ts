export default class MySQLConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  isAmazonRDS: boolean;

  constructor(props: any = {}) {
    Object.keys(props).forEach((key) => {
      this[key] = props[key];
    });
  }
}
