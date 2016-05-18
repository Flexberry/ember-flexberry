import Ember from 'ember';

export default Ember.Service.extend({
  tables: {
    employee: [
      {
        EmployeeID: 0, FirstName: 'Nancy', LastName: 'Nance', BirthDate: '2015-08-24T19:00:00Z',
        Employee1: { EmployeeID: 3, FirstName: 'Janet' },
        Orders: [
          {
            OrderID: 0, ShipName: 'Vins et alcools Chevalier7777', ShipCountry: 'France', OrderDate: '2016-04-22T13:48:11.173Z',
            Customer: { CustomerID: 'ERNSH', ContactName: 'Roland Mendel', },
          },
          {
            OrderID: 1, ShipName: 'Toms Spezialit4ten', ShipCountry: 'Germany', OrderDate: null,
            Customer: { CustomerID: 'WARTH', ContactName: 'Pirkko Koskitalo', },
          },
          {
            OrderID: 2, ShipName: 'Hanari Carnes', ShipCountry: 'Brazil', OrderDate: null,
            Customer: { CustomerID: 'MAGAA', ContactName: 'Giovanni Rovelli', },
          },
        ],
      },
      {
        EmployeeID: 1, FirstName: 'Andrew', LastName: 'Fullers', BirthDate:'1952-02-12T19:00:00Z',
        Employee1: { EmployeeID: 5, FirstName: 'Steven' },
        Orders: [
          {
            OrderID: 3, ShipName: 'Victuailles en stock', ShipCountry: 'France', OrderDate: '2016-03-14T01:01:00Z',
            Customer: { CustomerID: 'QUICK', ContactName: 'Horst Kloss', },
          },
          {
            OrderID: 4, ShipName: 'Suprames d9lices', ShipCountry: 'Belgium', OrderDate: '1996-07-09T00:00:00Z',
            Customer: { CustomerID: 'TRADH', ContactName: 'Anabela Domingues', },
          },
        ],
      },
      { EmployeeID: 2, FirstName: 'Janet', LastName: 'Leverling', BirthDate:'1963-08-30T00:00:00Z', Employee1: null },
      { EmployeeID: 3, FirstName: 'Margaret', LastName: 'Peacock', BirthDate:'1937-09-19T00:00:00Z', Employee1: { EmployeeID: 6, FirstName: 'Michael' } },
      { EmployeeID: 4, FirstName: 'Steven', LastName: 'Buchanan', BirthDate:'1955-03-04T00:00:00Z', Employee1: { EmployeeID: 13, FirstName: '8888888888' } },
      { EmployeeID: 5, FirstName: 'Michael', LastName: 'Suyama', BirthDate:null, Employee1: null },
      { EmployeeID: 6, FirstName: 'Robert', LastName: 'King', BirthDate:'1960-05-29T00:00:00Z', Employee1: { EmployeeID: 5, FirstName: 'Steven' } },
      { EmployeeID: 7, FirstName: 'Laura', LastName: 'Callahan', BirthDate:'1958-01-09T00:00:00Z', Employee1: { EmployeeID: 2, FirstName: 'Andrew' } },
      { EmployeeID: 8, FirstName: 'Anne87', LastName: 'Dodsworth', BirthDate:'1966-01-27T00:00:00Z', Employee1: { EmployeeID: 5, FirstName: 'Steven' } },
      { EmployeeID: 9, FirstName: 'qwerty', LastName: 'tttt23', BirthDate:null, Employee1: { EmployeeID: 8, FirstName: 'Laura' } },
      { EmployeeID: 10, FirstName: 'Test11', LastName: 'Test Save', BirthDate:'2015-05-14T19:00:00Z', Employee1: { EmployeeID: 2, FirstName: 'Andrew' } },
      { EmployeeID: 11, FirstName: 'TestSave2', LastName: 'TestSave2', BirthDate:null, Employee1: null },
      { EmployeeID: 12, FirstName: '8888888888', LastName: '8888888888888', BirthDate:null, Employee1: null },
      { EmployeeID: 13, FirstName: 'tmp77', LastName: 'tmp97', BirthDate:'2015-06-09T19:00:00Z', Employee1: { EmployeeID: 11, FirstName: 'Test11' } },
      { EmployeeID: 14, FirstName: 'zxcdxzcxz', LastName: 'zxczxcxz', BirthDate:'2016-05-04T19:00:00Z', Employee1: { EmployeeID: 4, FirstName: 'Margaret' } },
    ],
    order: [
      {
        OrderID: 0, ShipName: 'Vins et alcools Chevalier7777', ShipCountry: 'France', OrderDate: '2016-04-22T13:48:11.173Z',
        Customer: { CustomerID: 'ERNSH', ContactName: 'Roland Mendel', },
      },
      {
        OrderID: 1, ShipName: 'Toms Spezialit4ten', ShipCountry: 'Germany', OrderDate: null,
        Customer: { CustomerID: 'WARTH', ContactName: 'Pirkko Koskitalo', },
      },
      {
        OrderID: 2, ShipName: 'Hanari Carnes', ShipCountry: 'Brazil', OrderDate: null,
        Customer: { CustomerID: 'MAGAA', ContactName: 'Giovanni Rovelli', },
      },
      {
        OrderID: 3, ShipName: 'Victuailles en stock', ShipCountry: 'France', OrderDate: '2016-03-14T01:01:00Z',
        Customer: { CustomerID: 'QUICK', ContactName: 'Horst Kloss', },
      },
      {
        OrderID: 4, ShipName: 'Suprames d9lices', ShipCountry: 'Belgium', OrderDate: '1996-07-09T00:00:00Z',
        Customer: { CustomerID: 'TRADH', ContactName: 'Anabela Domingues', },
      },
    ],
  },

  init() {
    this._super(...arguments);
    window.fakeBD = this;
  },

  select(tableName) {
    Ember.assert('Table not exist!', this._tableExist(tableName));
    return this.get('tables')[tableName];
  },

  getRecord(tableName, id) {
    Ember.assert('Table not exist!', this._tableExist(tableName));

    let index = this._getIndexById(tableName, id);
    Ember.assert('Record not exist!', !Ember.isNone(index));

    return this.get('tables')[tableName][index];
  },

  createRecord(table, data) {
    let tables = this.get('tables');
    if (!this._tableExist(table)) {
      tables[table] = [];
    }

    let id = tables[table].length;
    let primaryKey = this._primaryKey(table);
    data[primaryKey] = id;
    tables[table].push(data);
    return data;
  },

  updateRecord(tableName, id, data) {
    Ember.assert('Table not exist!', this._tableExist(tableName));

    let index = this._getIndexById(tableName, id);
    Ember.assert('Record not exist!', !Ember.isNone(index));

    return Ember.merge(this.get('tables')[tableName][index], data);
  },

  deleteRecord(tableName, id) {
    Ember.assert('Table not exist!', this._tableExist(tableName));

    let index = this._getIndexById(tableName, id);
    Ember.assert('Record not exist!', !Ember.isNone(index));

    this.get('tables')[tableName].splice(index, 1);
    return id;
  },

  _primaryKey(modelName) {
    return Ember.String.capitalize(modelName) + 'ID';
  },

  _tableExist(tableName) {
    return this.get('tables').hasOwnProperty(tableName);
  },

  _getIndexById(tableName, id) {
    let index;
    let primaryKey = this._primaryKey(tableName);
    this.get('tables')[tableName].forEach((item, i, array) => {
      if (item[primaryKey] == id) {
        index = i;
      }
    });
    return index;
  },
});
