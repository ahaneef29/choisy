import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private _setting = 'setting';
  private _customer = 'user';

  schema = {
    stores: [
      {
        name: this._setting,
        columns: [
          {
            name: 'key',
            isPrimaryKey: true,
            type: 'TEXT',
          },
          {
            name: 'value',
            type: 'TEXT',
          },
        ],
      },
      {
        name: this._customer,
        columns: [
          {
            name: 'email',
            isPrimaryKey: true,
            type: 'TEXT',
          },
          {
            name: 'name',
            type: 'TEXT',
          }
        ],
      },
    ],
  };
  tables = {
    setting: this._setting,
    customer: this._customer,
  };

  constructor() {}
}

export interface ITableOptions {
  name: string;
  columns: Array<{ name; isPrimaryKey?; type? }>;
  autoIncrement?: boolean;
}
