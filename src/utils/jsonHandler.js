import { JSONPath } from 'jsonpath-plus';
import moment from 'moment';
import _ from 'lodash';



class SnapLogicFunctionHandler {
  constructor() {
      this.context = {};
      this.initializeFunctionGroups();
  }

  initializeFunctionGroups() {
      this.stringFunctions = this.createStringFunctions();
      this.numberFunctions = this.createNumberFunctions();
      this.arrayFunctions = this.createArrayFunctions();
      this.objectFunctions = this.createObjectFunctions();
      this.dateFunctions = this.createDateFunctions();
      this.jsonFunctions = this.createJSONFunctions();
      this.matchFunctions = this.createMatchFunctions();
      this.typeFunctions = this.createTypeFunctions();
      this.mathFunctions = this.createMathFunctions();
  }

  execute(functionName, args, context = {}) {
      this.context = context;
      
      try {
          if (typeof functionName === 'string' && functionName.includes('(')) {
              return this.handleNestedFunctionCalls(functionName);
          }

          const functionGroup = this.getFunctionGroup(functionName);
          if (functionGroup && typeof functionGroup[functionName] === 'function') {
              return functionGroup[functionName](...args);
          }

          return this.handleGlobalFunctions(functionName, args);
      } catch (error) {
          console.error(`Error executing function ${functionName}:`, error);
          return null;
      }
  }

  getFunctionGroup(functionName) {
      const functionGroups = {
          toLowerCase: this.stringFunctions,
          toUpperCase: this.stringFunctions,
          trim: this.stringFunctions,
          round: this.numberFunctions,
          floor: this.numberFunctions,
          ceil: this.numberFunctions,
          map: this.arrayFunctions,
          filter: this.arrayFunctions,
          find: this.arrayFunctions
      };
      return functionGroups[functionName];
  }

createStringFunctions() {
  return {
    // Basic String Operations
    toLowerCase: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeStringFunction(item, 'toLowerCase'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeStringFunction(v, 'toLowerCase')])
        );
      }
      return String(value).toLowerCase();
    },

    toUpperCase: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeStringFunction(item, 'toUpperCase'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeStringFunction(v, 'toUpperCase')])
        );
      }
      return String(value).toUpperCase();
    },

    trim: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeStringFunction(item, 'trim'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeStringFunction(v, 'trim')])
        );
      }
      return String(value).trim();
    },

    // String Analysis
    length: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeStringFunction(item, 'length'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeStringFunction(v, 'length')])
        );
      }
      return String(value).length;
    },

    // String Search and Replace
    contains: (value, searchStr) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeStringFunction(item, 'contains', searchStr));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeStringFunction(v, 'contains', searchStr)])
        );
      }
      return String(value).includes(searchStr);
    },

    startsWith: (value, searchStr) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeStringFunction(item, 'startsWith', searchStr));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeStringFunction(v, 'startsWith', searchStr)])
        );
      }
      return String(value).startsWith(searchStr);
    },

    endsWith: (value, searchStr) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeStringFunction(item, 'endsWith', searchStr));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeStringFunction(v, 'endsWith', searchStr)])
        );
      }
      return String(value).endsWith(searchStr);
    },

    replace: (value, searchValue, replaceValue) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeStringFunction(item, 'replace', searchValue, replaceValue));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeStringFunction(v, 'replace', searchValue, replaceValue)])
        );
      }
      return String(value).replace(searchValue, replaceValue);
    },

    // String Manipulation
    substring: (value, start, end) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeStringFunction(item, 'substring', start, end));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeStringFunction(v, 'substring', start, end)])
        );
      }
      return String(value).substring(start, end);
    },

    split: (value, separator) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeStringFunction(item, 'split', separator));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeStringFunction(v, 'split', separator)])
        );
      }
      return String(value).split(separator);
    },

    // Case Transformations
    capitalize: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeStringFunction(item, 'capitalize'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeStringFunction(v, 'capitalize')])
        );
      }
      const str = String(value);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Helper method for string operations
    executeStringFunction: (value, functionName, ...args) => {
      if (value === null || value === undefined) {
        return value;
      }
      const str = String(value);
      switch (functionName) {
        case 'toLowerCase': return str.toLowerCase();
        case 'toUpperCase': return str.toUpperCase();
        case 'trim': return str.trim();
        case 'length': return str.length;
        case 'contains': return str.includes(args[0]);
        case 'startsWith': return str.startsWith(args[0]);
        case 'endsWith': return str.endsWith(args[0]);
        case 'replace': return str.replace(args[0], args[1]);
        case 'substring': return str.substring(args[0], args[1]);
        case 'split': return str.split(args[0]);
        case 'capitalize': return str.charAt(0).toUpperCase() + str.slice(1);
        default: return str;
      }
    }
  };
}
createNumberFunctions() {
  return {
    // Basic Number Operations
    toString: (value, radix = 10) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'toString', radix));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'toString', radix)])
        );
      }
      return Number(value).toString(radix);
    },

    toFixed: (value, digits = 2) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'toFixed', digits));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'toFixed', digits)])
        );
      }
      return Number(value).toFixed(digits);
    },

    toPrecision: (value, precision) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'toPrecision', precision));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'toPrecision', precision)])
        );
      }
      return Number(value).toPrecision(precision);
    },

    toExponential: (value, fractionDigits) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'toExponential', fractionDigits));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'toExponential', fractionDigits)])
        );
      }
      return Number(value).toExponential(fractionDigits);
    },

    // Currency Formatting
    toCurrency: (value, currency = 'USD', locale = 'en-US') => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'toCurrency', currency, locale));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'toCurrency', currency, locale)])
        );
      }
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      }).format(Number(value));
    },

    // Math Operations
    round: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'round'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'round')])
        );
      }
      return Math.round(Number(value));
    },

    floor: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'floor'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'floor')])
        );
      }
      return Math.floor(Number(value));
    },

    ceil: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'ceil'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'ceil')])
        );
      }
      return Math.ceil(Number(value));
    },

    // Number Validation
    isInteger: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'isInteger'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'isInteger')])
        );
      }
      return Number.isInteger(Number(value));
    },

    isFinite: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'isFinite'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'isFinite')])
        );
      }
      return Number.isFinite(Number(value));
    },

    // Arithmetic Operations
    add: (value, n) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'add', n));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'add', n)])
        );
      }
      return Number(value) + Number(n);
    },

    subtract: (value, n) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'subtract', n));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'subtract', n)])
        );
      }
      return Number(value) - Number(n);
    },

    multiply: (value, n) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'multiply', n));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'multiply', n)])
        );
      }
      return Number(value) * Number(n);
    },

    divide: (value, n) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeNumberFunction(item, 'divide', n));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeNumberFunction(v, 'divide', n)])
        );
      }
      return Number(value) / Number(n);
    },

    // Helper method for number operations
    executeNumberFunction: (value, functionName, ...args) => {
      if (value === null || value === undefined) {
        return value;
      }
      const num = Number(value);
      switch (functionName) {
        case 'toString': return num.toString(args[0]);
        case 'toFixed': return num.toFixed(args[0]);
        case 'toPrecision': return num.toPrecision(args[0]);
        case 'toExponential': return num.toExponential(args[0]);
        case 'toCurrency': return new Intl.NumberFormat(args[1], {
          style: 'currency',
          currency: args[0]
        }).format(num);
        case 'round': return Math.round(num);
        case 'floor': return Math.floor(num);
        case 'ceil': return Math.ceil(num);
        case 'isInteger': return Number.isInteger(num);
        case 'isFinite': return Number.isFinite(num);
        case 'add': return num + Number(args[0]);
        case 'subtract': return num - Number(args[0]);
        case 'multiply': return num * Number(args[0]);
        case 'divide': return num / Number(args[0]);
        default: return num;
      }
    }
  };
}
createArrayFunctions() {
  return {
    // Array Transformation
    map: (arr, mapper) => {
      if (Array.isArray(arr)) {
        return arr.map(item => this.executeArrayFunction(item, 'map', mapper));
      }
      if (typeof arr === 'object' && arr !== null) {
        return Object.fromEntries(
          Object.entries(arr).map(([k, v]) => [k, this.executeArrayFunction(v, 'map', mapper)])
        );
      }
      return arr;
    },

    filter: (arr, predicate) => {
      if (Array.isArray(arr)) {
        return arr.filter(item => this.executeArrayFunction(item, 'filter', predicate));
      }
      if (typeof arr === 'object' && arr !== null) {
        return Object.fromEntries(
          Object.entries(arr).map(([k, v]) => [k, this.executeArrayFunction(v, 'filter', predicate)])
        );
      }
      return arr;
    },

    find: (arr, predicate) => {
      if (Array.isArray(arr)) {
        return arr.find(item => this.executeArrayFunction(item, 'find', predicate));
      }
      if (typeof arr === 'object' && arr !== null) {
        return Object.fromEntries(
          Object.entries(arr).map(([k, v]) => [k, this.executeArrayFunction(v, 'find', predicate)])
        );
      }
      return null;
    },

    // Array Calculations
    sum: (arr) => {
      if (Array.isArray(arr)) {
        return this.executeArrayFunction(arr, 'sum');
      }
      if (typeof arr === 'object' && arr !== null) {
        return Object.fromEntries(
          Object.entries(arr).map(([k, v]) => [k, this.executeArrayFunction(v, 'sum')])
        );
      }
      return 0;
    },

    average: (arr) => {
      if (Array.isArray(arr)) {
        return this.executeArrayFunction(arr, 'average');
      }
      if (typeof arr === 'object' && arr !== null) {
        return Object.fromEntries(
          Object.entries(arr).map(([k, v]) => [k, this.executeArrayFunction(v, 'average')])
        );
      }
      return 0;
    },

    // Array Utilities
    sort: (arr, comparator) => {
      if (Array.isArray(arr)) {
        return this.executeArrayFunction(arr, 'sort', comparator);
      }
      if (typeof arr === 'object' && arr !== null) {
        return Object.fromEntries(
          Object.entries(arr).map(([k, v]) => [k, this.executeArrayFunction(v, 'sort', comparator)])
        );
      }
      return arr;
    },

    unique: (arr) => {
      if (Array.isArray(arr)) {
        return this.executeArrayFunction(arr, 'unique');
      }
      if (typeof arr === 'object' && arr !== null) {
        return Object.fromEntries(
          Object.entries(arr).map(([k, v]) => [k, this.executeArrayFunction(v, 'unique')])
        );
      }
      return arr;
    },

    // Array Element Access
    first: (arr) => {
      if (Array.isArray(arr)) {
        return this.executeArrayFunction(arr, 'first');
      }
      if (typeof arr === 'object' && arr !== null) {
        return Object.fromEntries(
          Object.entries(arr).map(([k, v]) => [k, this.executeArrayFunction(v, 'first')])
        );
      }
      return null;
    },

    last: (arr) => {
      if (Array.isArray(arr)) {
        return this.executeArrayFunction(arr, 'last');
      }
      if (typeof arr === 'object' && arr !== null) {
        return Object.fromEntries(
          Object.entries(arr).map(([k, v]) => [k, this.executeArrayFunction(v, 'last')])
        );
      }
      return null;
    },

    // Helper method for array operations
    executeArrayFunction: (value, functionName, ...args) => {
      if (value === null || value === undefined) {
        return value;
      }
      if (!Array.isArray(value)) {
        return value;
      }

      switch (functionName) {
        case 'map':
          if (typeof args[0] === 'string') {
            if (!args[0].includes('(')) {
              return value.map(item => item[args[0]]);
            }
            const mapFn = new Function('item', `return ${args[0]}`);
            return value.map(item => mapFn(item));
          }
          return value.map(args[0]);

        case 'filter':
          if (typeof args[0] === 'string') {
            const filterFn = new Function('item', `return ${args[0]}`);
            return value.filter(item => filterFn(item));
          }
          return value.filter(args[0]);

        case 'find':
          if (typeof args[0] === 'string') {
            const findFn = new Function('item', `return ${args[0]}`);
            return value.find(item => findFn(item));
          }
          return value.find(args[0]);

        case 'sum':
          return value.reduce((sum, item) => sum + Number(item), 0);

        case 'average':
          return value.length ? value.reduce((sum, item) => sum + Number(item), 0) / value.length : 0;

        case 'sort':
          if (typeof args[0] === 'string') {
            const sortFn = new Function('a', 'b', `return ${args[0]}`);
            return [...value].sort((a, b) => sortFn(a, b));
          }
          return [...value].sort(args[0]);

        case 'unique':
          return [...new Set(value)];

        case 'first':
          return value[0];

        case 'last':
          return value[value.length - 1];

        default:
          return value;
      }
    }
  };
}
createObjectFunctions() {
  return {
    // Object Property Access
    get: (obj, path, defaultValue = null) => {
      if (Array.isArray(obj)) {
        return obj.map(item => this.executeObjectFunction(item, 'get', path, defaultValue));
      }
      if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, this.executeObjectFunction(v, 'get', path, defaultValue)])
        );
      }
      return this.executeObjectFunction(obj, 'get', path, defaultValue);
    },

    // Object Property Check
    has: (obj, path) => {
      if (Array.isArray(obj)) {
        return obj.map(item => this.executeObjectFunction(item, 'has', path));
      }
      if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, this.executeObjectFunction(v, 'has', path)])
        );
      }
      return this.executeObjectFunction(obj, 'has', path);
    },

    // Object Keys/Values/Entries
    keys: (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => this.executeObjectFunction(item, 'keys'));
      }
      if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, this.executeObjectFunction(v, 'keys')])
        );
      }
      return this.executeObjectFunction(obj, 'keys');
    },

    values: (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => this.executeObjectFunction(item, 'values'));
      }
      if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, this.executeObjectFunction(v, 'values')])
        );
      }
      return this.executeObjectFunction(obj, 'values');
    },

    entries: (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => this.executeObjectFunction(item, 'entries'));
      }
      if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, this.executeObjectFunction(v, 'entries')])
        );
      }
      return this.executeObjectFunction(obj, 'entries');
    },

    // Object Transformation
    mapKeys: (obj, mapper) => {
      if (Array.isArray(obj)) {
        return obj.map(item => this.executeObjectFunction(item, 'mapKeys', mapper));
      }
      if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, this.executeObjectFunction(v, 'mapKeys', mapper)])
        );
      }
      return this.executeObjectFunction(obj, 'mapKeys', mapper);
    },

    mapValues: (obj, mapper) => {
      if (Array.isArray(obj)) {
        return obj.map(item => this.executeObjectFunction(item, 'mapValues', mapper));
      }
      if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, this.executeObjectFunction(v, 'mapValues', mapper)])
        );
      }
      return this.executeObjectFunction(obj, 'mapValues', mapper);
    },

    // Object Merging
    merge: (obj, ...sources) => {
      if (Array.isArray(obj)) {
        return obj.map(item => this.executeObjectFunction(item, 'merge', ...sources));
      }
      if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, this.executeObjectFunction(v, 'merge', ...sources)])
        );
      }
      return this.executeObjectFunction(obj, 'merge', ...sources);
    },

    // Object Filtering
    pick: (obj, paths) => {
      if (Array.isArray(obj)) {
        return obj.map(item => this.executeObjectFunction(item, 'pick', paths));
      }
      if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, this.executeObjectFunction(v, 'pick', paths)])
        );
      }
      return this.executeObjectFunction(obj, 'pick', paths);
    },

    omit: (obj, paths) => {
      if (Array.isArray(obj)) {
        return obj.map(item => this.executeObjectFunction(item, 'omit', paths));
      }
      if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, this.executeObjectFunction(v, 'omit', paths)])
        );
      }
      return this.executeObjectFunction(obj, 'omit', paths);
    },

    // Helper method for object operations
    executeObjectFunction: (value, functionName, ...args) => {
      if (value === null || value === undefined) {
        return value;
      }

      const obj = typeof value === 'object' ? value : { value };

      switch (functionName) {
        case 'get':
          return _.get(obj, args[0], args[1]);

        case 'has':
          return _.has(obj, args[0]);

        case 'keys':
          return Object.keys(obj);

        case 'values':
          return Object.values(obj);

        case 'entries':
          return Object.entries(obj);

        case 'mapKeys':
          if (typeof args[0] === 'string') {
            const mapKeysFn = new Function('key', 'value', `return ${args[0]}`);
            return _.mapKeys(obj, (value, key) => mapKeysFn(key, value));
          }
          return _.mapKeys(obj, args[0]);

        case 'mapValues':
          if (typeof args[0] === 'string') {
            const mapValuesFn = new Function('value', 'key', `return ${args[0]}`);
            return _.mapValues(obj, (value, key) => mapValuesFn(value, key));
          }
          return _.mapValues(obj, args[0]);

        case 'merge':
          return _.merge({}, obj, ...args);

        case 'pick':
          return _.pick(obj, args[0]);

        case 'omit':
          return _.omit(obj, args[0]);

        default:
          return obj;
      }
    }
  };
}
createDateFunctions() {
  return {
    // Date Creation
    parse: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeDateFunction(item, 'parse'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeDateFunction(v, 'parse')])
        );
      }
      return this.executeDateFunction(value, 'parse');
    },

    // Date Getters
    getDate: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeDateFunction(item, 'getDate'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeDateFunction(v, 'getDate')])
        );
      }
      return this.executeDateFunction(value, 'getDate');
    },

    getMonth: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeDateFunction(item, 'getMonth'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeDateFunction(v, 'getMonth')])
        );
      }
      return this.executeDateFunction(value, 'getMonth');
    },

    getYear: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeDateFunction(item, 'getYear'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeDateFunction(v, 'getYear')])
        );
      }
      return this.executeDateFunction(value, 'getYear');
    },

    // Date Arithmetic
    addDays: (value, days) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeDateFunction(item, 'addDays', days));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeDateFunction(v, 'addDays', days)])
        );
      }
      return this.executeDateFunction(value, 'addDays', days);
    },

    addMonths: (value, months) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeDateFunction(item, 'addMonths', months));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeDateFunction(v, 'addMonths', months)])
        );
      }
      return this.executeDateFunction(value, 'addMonths', months);
    },

    // Date Formatting
    format: (value, format) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeDateFunction(item, 'format', format));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeDateFunction(v, 'format', format)])
        );
      }
      return this.executeDateFunction(value, 'format', format);
    },

    // Date Comparison
    isBefore: (value, compareDate) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeDateFunction(item, 'isBefore', compareDate));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeDateFunction(v, 'isBefore', compareDate)])
        );
      }
      return this.executeDateFunction(value, 'isBefore', compareDate);
    },

    isAfter: (value, compareDate) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeDateFunction(item, 'isAfter', compareDate));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeDateFunction(v, 'isAfter', compareDate)])
        );
      }
      return this.executeDateFunction(value, 'isAfter', compareDate);
    },

    // Helper method for date operations
    executeDateFunction: (value, functionName, ...args) => {
      if (value === null || value === undefined) {
        return value;
      }

      try {
        const momentDate = moment(value);
        if (!momentDate.isValid()) {
          return null;
        }

        switch (functionName) {
          case 'parse':
            return momentDate.toDate();

          case 'getDate':
            return momentDate.date();

          case 'getMonth':
            return momentDate.month() + 1; // Making it 1-based

          case 'getYear':
            return momentDate.year();

          case 'addDays':
            return momentDate.add(args[0], 'days').toDate();

          case 'addMonths':
            return momentDate.add(args[0], 'months').toDate();

          case 'format':
            return momentDate.format(args[0] || 'YYYY-MM-DD');

          case 'isBefore':
            return momentDate.isBefore(moment(args[0]));

          case 'isAfter':
            return momentDate.isAfter(moment(args[0]));

          default:
            return momentDate.toDate();
        }
      } catch (error) {
        console.error(`Error in date operation ${functionName}:`, error);
        return null;
      }
    }
  };
}
createJSONFunctions() {
  return {
    // JSON Parsing and Stringification
    parse: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeJSONFunction(item, 'parse'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeJSONFunction(v, 'parse')])
        );
      }
      return this.executeJSONFunction(value, 'parse');
    },

    stringify: (value, space = 2) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeJSONFunction(item, 'stringify', space));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeJSONFunction(v, 'stringify', space)])
        );
      }
      return this.executeJSONFunction(value, 'stringify', space);
    },

    // JSONPath Operations
    query: (value, path) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeJSONFunction(item, 'query', path));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeJSONFunction(v, 'query', path)])
        );
      }
      return this.executeJSONFunction(value, 'query', path);
    },

    // JSON Transformation
    transform: (value, template) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeJSONFunction(item, 'transform', template));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeJSONFunction(v, 'transform', template)])
        );
      }
      return this.executeJSONFunction(value, 'transform', template);
    },

    // JSON Validation
    validate: (value, schema) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeJSONFunction(item, 'validate', schema));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeJSONFunction(v, 'validate', schema)])
        );
      }
      return this.executeJSONFunction(value, 'validate', schema);
    },

    // JSON Merging
    merge: (value, source) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeJSONFunction(item, 'merge', source));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeJSONFunction(v, 'merge', source)])
        );
      }
      return this.executeJSONFunction(value, 'merge', source);
    },

    // Helper method for JSON operations
    executeJSONFunction: (value, functionName, ...args) => {
      if (value === null || value === undefined) {
        return value;
      }

      try {
        switch (functionName) {
          case 'parse':
            return typeof value === 'string' ? JSON.parse(value) : value;

          case 'stringify':
            return JSON.stringify(value, null, args[0]);

          case 'query':
            const jsonPath = args[0];
            return JSONPath({ path: jsonPath, json: value });

          case 'transform':
            const template = args[0];
            return this.transformJSON(value, template);

          case 'validate':
            const schema = args[0];
            return this.validateJSON(value, schema);

          case 'merge':
            const source = args[0];
            return _.merge({}, value, source);

          default:
            return value;
        }
      } catch (error) {
        console.error(`Error in JSON operation ${functionName}:`, error);
        return null;
      }
    },

    // Helper method for JSON transformation
    transformJSON: (data, template) => {
      if (typeof template === 'function') {
        return template(data);
      }

      if (Array.isArray(template)) {
        return template.map(item => this.transformJSON(data, item));
      }

      if (typeof template === 'object' && template !== null) {
        return Object.fromEntries(
          Object.entries(template).map(([key, value]) => [
            key,
            typeof value === 'string' && value.startsWith('$')
              ? JSONPath({ path: value, json: data })[0]
              : this.transformJSON(data, value)
          ])
        );
      }

      return template;
    },

    // Helper method for JSON validation
    validateJSON: (data, schema) => {
      // Implement your JSON schema validation logic here
      // You can use libraries like Ajv or json-schema
      return true; // Placeholder
    }
  };
}
createMatchFunctions() {
  return {
    // Pattern Matching
    match: (value, patterns) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeMatchFunction(item, 'match', patterns));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMatchFunction(v, 'match', patterns)])
        );
      }
      return this.executeMatchFunction(value, 'match', patterns);
    },

    // Regular Expression Operations
    test: (value, regex) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeMatchFunction(item, 'test', regex));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMatchFunction(v, 'test', regex)])
        );
      }
      return this.executeMatchFunction(value, 'test', regex);
    },

    // Pattern Extraction
    extract: (value, pattern) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeMatchFunction(item, 'extract', pattern));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMatchFunction(v, 'extract', pattern)])
        );
      }
      return this.executeMatchFunction(value, 'extract', pattern);
    },

    // Conditional Pattern Matching
    when: (value, conditions) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeMatchFunction(item, 'when', conditions));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMatchFunction(v, 'when', conditions)])
        );
      }
      return this.executeMatchFunction(value, 'when', conditions);
    },

    // Helper method for match operations
    executeMatchFunction: (value, functionName, ...args) => {
      if (value === null || value === undefined) {
        return value;
      }

      try {
        switch (functionName) {
          case 'match':
            const patterns = args[0];
            return this.executePatternMatch(value, patterns);

          case 'test':
            const regex = typeof args[0] === 'string' ? new RegExp(args[0]) : args[0];
            return regex.test(String(value));

          case 'extract':
            const pattern = typeof args[0] === 'string' ? new RegExp(args[0], 'g') : args[0];
            const matches = String(value).match(pattern);
            return matches || [];

          case 'when':
            const conditions = args[0];
            return this.executeConditionalMatch(value, conditions);

          default:
            return value;
        }
      } catch (error) {
        console.error(`Error in match operation ${functionName}:`, error);
        return null;
      }
    },

    // Helper method for pattern matching
    executePatternMatch: (value, patterns) => {
      for (const [pattern, result] of Object.entries(patterns)) {
        // Handle regex patterns
        if (pattern.startsWith('/') && pattern.endsWith('/')) {
          const regex = new RegExp(pattern.slice(1, -1));
          if (regex.test(String(value))) {
            return typeof result === 'function' ? result(value) : result;
          }
          continue;
        }

        // Handle exact matches
        if (value === pattern) {
          return typeof result === 'function' ? result(value) : result;
        }

        // Handle wildcard patterns
        if (pattern === '_') {
          return typeof result === 'function' ? result(value) : result;
        }
      }
      return value;
    },

    // Helper method for conditional matching
    executeConditionalMatch: (value, conditions) => {
      for (const [condition, result] of Object.entries(conditions)) {
        try {
          const conditionFn = new Function('value', `return ${condition}`);
          if (conditionFn(value)) {
            return typeof result === 'function' ? result(value) : result;
          }
        } catch (error) {
          console.error(`Error evaluating condition: ${condition}`, error);
        }
      }
      return value;
    }
  };
}
createTypeFunctions() {
  return {
    // Type Checking
    typeof: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeTypeFunction(item, 'typeof'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeTypeFunction(v, 'typeof')])
        );
      }
      return this.executeTypeFunction(value, 'typeof');
    },

    isNull: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeTypeFunction(item, 'isNull'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeTypeFunction(v, 'isNull')])
        );
      }
      return this.executeTypeFunction(value, 'isNull');
    },

    isUndefined: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeTypeFunction(item, 'isUndefined'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeTypeFunction(v, 'isUndefined')])
        );
      }
      return this.executeTypeFunction(value, 'isUndefined');
    },

    // Type Conversion
    toString: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeTypeFunction(item, 'toString'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeTypeFunction(v, 'toString')])
        );
      }
      return this.executeTypeFunction(value, 'toString');
    },

    toNumber: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeTypeFunction(item, 'toNumber'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeTypeFunction(v, 'toNumber')])
        );
      }
      return this.executeTypeFunction(value, 'toNumber');
    },

    toBoolean: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeTypeFunction(item, 'toBoolean'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeTypeFunction(v, 'toBoolean')])
        );
      }
      return this.executeTypeFunction(value, 'toBoolean');
    },

    // Type Validation
    validate: (value, schema) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeTypeFunction(item, 'validate', schema));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeTypeFunction(v, 'validate', schema)])
        );
      }
      return this.executeTypeFunction(value, 'validate', schema);
    },

    // Helper method for type operations
    executeTypeFunction: (value, functionName, ...args) => {
      try {
        switch (functionName) {
          case 'typeof':
            if (value === null) return 'null';
            if (Array.isArray(value)) return 'array';
            return typeof value;

          case 'isNull':
            return value === null;

          case 'isUndefined':
            return value === undefined;

          case 'toString':
            if (value === null) return 'null';
            if (value === undefined) return 'undefined';
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);

          case 'toNumber':
            if (value === null || value === undefined) return 0;
            const num = Number(value);
            return isNaN(num) ? 0 : num;

          case 'toBoolean':
            if (typeof value === 'string') {
              const lowered = value.toLowerCase();
              if (lowered === 'true') return true;
              if (lowered === 'false') return false;
            }
            return Boolean(value);

          case 'validate':
            return this.validateType(value, args[0]);

          default:
            return value;
        }
      } catch (error) {
        console.error(`Error in type operation ${functionName}:`, error);
        return null;
      }
    },

    // Helper method for type validation
    validateType: (value, schema) => {
      if (!schema) return true;

      const type = schema.type || 'any';
      const required = schema.required || false;
      const pattern = schema.pattern ? new RegExp(schema.pattern) : null;
      const min = schema.min !== undefined ? schema.min : -Infinity;
      const max = schema.max !== undefined ? schema.max : Infinity;
      const enum_ = schema.enum || null;

      // Check required
      if (required && (value === null || value === undefined)) {
        return false;
      }

      // Skip other checks if value is null/undefined and not required
      if (value === null || value === undefined) {
        return true;
      }

      // Check type
      switch (type) {
        case 'string':
          if (typeof value !== 'string') return false;
          if (pattern && !pattern.test(value)) return false;
          if (min !== -Infinity && value.length < min) return false;
          if (max !== Infinity && value.length > max) return false;
          break;

        case 'number':
          if (typeof value !== 'number') return false;
          if (min !== -Infinity && value < min) return false;
          if (max !== Infinity && value > max) return false;
          break;

        case 'boolean':
          if (typeof value !== 'boolean') return false;
          break;

        case 'array':
          if (!Array.isArray(value)) return false;
          if (min !== -Infinity && value.length < min) return false;
          if (max !== Infinity && value.length > max) return false;
          break;

        case 'object':
          if (typeof value !== 'object' || Array.isArray(value)) return false;
          break;
      }

      // Check enum
      if (enum_ && !enum_.includes(value)) {
        return false;
      }

      return true;
    }
  };
}
createMathFunctions() {
  return {
    // Basic Math Operations
    abs: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeMathFunction(item, 'abs'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMathFunction(v, 'abs')])
        );
      }
      return this.executeMathFunction(value, 'abs');
    },

    round: (value, precision = 0) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeMathFunction(item, 'round', precision));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMathFunction(v, 'round', precision)])
        );
      }
      return this.executeMathFunction(value, 'round', precision);
    },

    // Advanced Math Operations
    pow: (value, exponent) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeMathFunction(item, 'pow', exponent));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMathFunction(v, 'pow', exponent)])
        );
      }
      return this.executeMathFunction(value, 'pow', exponent);
    },

    sqrt: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeMathFunction(item, 'sqrt'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMathFunction(v, 'sqrt')])
        );
      }
      return this.executeMathFunction(value, 'sqrt');
    },

    // Statistical Functions
    min: (value) => {
      if (Array.isArray(value)) {
        return this.executeMathFunction(value, 'min');
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMathFunction(v, 'min')])
        );
      }
      return value;
    },

    max: (value) => {
      if (Array.isArray(value)) {
        return this.executeMathFunction(value, 'max');
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMathFunction(v, 'max')])
        );
      }
      return value;
    },

    sum: (value) => {
      if (Array.isArray(value)) {
        return this.executeMathFunction(value, 'sum');
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMathFunction(v, 'sum')])
        );
      }
      return value;
    },

    average: (value) => {
      if (Array.isArray(value)) {
        return this.executeMathFunction(value, 'average');
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMathFunction(v, 'average')])
        );
      }
      return value;
    },

    // Trigonometric Functions
    sin: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeMathFunction(item, 'sin'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMathFunction(v, 'sin')])
        );
      }
      return this.executeMathFunction(value, 'sin');
    },

    cos: (value) => {
      if (Array.isArray(value)) {
        return value.map(item => this.executeMathFunction(item, 'cos'));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [k, this.executeMathFunction(v, 'cos')])
        );
      }
      return this.executeMathFunction(value, 'cos');
    },

    // Helper method for math operations
    executeMathFunction: (value, functionName, ...args) => {
      if (value === null || value === undefined) {
        return value;
      }

      try {
        switch (functionName) {
          case 'abs':
            return Math.abs(Number(value));

          case 'round':
            const precision = args[0] || 0;
            const multiplier = Math.pow(10, precision);
            return Math.round(Number(value) * multiplier) / multiplier;

          case 'pow':
            return Math.pow(Number(value), Number(args[0]));

          case 'sqrt':
            return Math.sqrt(Number(value));

          case 'min':
            return Array.isArray(value) ? Math.min(...value.map(Number)) : Number(value);

          case 'max':
            return Array.isArray(value) ? Math.max(...value.map(Number)) : Number(value);

          case 'sum':
            return Array.isArray(value) ? value.reduce((a, b) => Number(a) + Number(b), 0) : Number(value);

          case 'average':
            return Array.isArray(value) ? 
              value.reduce((a, b) => Number(a) + Number(b), 0) / value.length : 
              Number(value);

          case 'sin':
            return Math.sin(Number(value));

          case 'cos':
            return Math.cos(Number(value));

          default:
            return Number(value);
        }
      } catch (error) {
        console.error(`Error in math operation ${functionName}:`, error);
        return null;
      }
    }
  };
}
handleJSONPathExpression(expression, data) {
  try {
    // Handle array index access after JSONPath
    const indexMatch = expression.match(/\[(\d+)\]$/);
    if (indexMatch) {
      const basePath = expression.replace(/\[\d+\]$/, '');
      const index = parseInt(indexMatch[1]);
      const result = this.evaluateJSONPath(basePath, data);
      return Array.isArray(result) ? result[index] : null;
    }

    return this.evaluateJSONPath(expression, data);
  } catch (error) {
    console.error('Error in JSONPath expression:', error);
    return null;
  }
}

evaluateJSONPath(path, data) {
  // Remove the leading $ if present
  path = path.startsWith('$') ? path.slice(1) : path;
  
  // Split the path into segments
  const segments = path.split('.');
  
  let current = data;
  
  for (const segment of segments) {
    // Handle array access with [*]
    if (segment.endsWith('[*]')) {
      const arrayKey = segment.slice(0, -3);
      current = current[arrayKey];
      if (!Array.isArray(current)) return null;
      continue;
    }

    // Handle array access with specific index
    const arrayMatch = segment.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const [, key, index] = arrayMatch;
      current = current[key]?.[parseInt(index)];
      continue;
    }

    // Handle array filtering
    const filterMatch = segment.match(/(\w+)\[\?\((.*?)\)\]/);
    if (filterMatch) {
      const [, key, condition] = filterMatch;
      const array = current[key];
      if (!Array.isArray(array)) return null;
      
      current = array.filter(item => {
        try {
          // Replace @. with item. in the condition
          const itemCondition = condition.replace(/@\./g, 'item.');
          return new Function('item', `return ${itemCondition}`)(item);
        } catch (e) {
          return false;
        }
      });
      continue;
    }

    // Regular property access
    current = current[segment];
  }

  return current;
}
handleMapper(inputData, mappingTemplate) {
  try {
      // Handle array input - take first element if array
      const data = Array.isArray(inputData) ? inputData[0] : inputData;
      const result = {};

      for (const [key, value] of Object.entries(mappingTemplate)) {
          // Handle nested object keys (with dots)
          if (key.includes('.')) {
              const parts = key.split('.');
              let current = result;
              
              // Create nested structure
              for (let i = 0; i < parts.length - 1; i++) {
                  if (!current[parts[i]]) {
                      current[parts[i]] = {};
                  }
                  current = current[parts[i]];
              }
              
              // Set the value in the nested structure
              current[parts[parts.length - 1]] = this.resolveValue(value, data);
              continue;
          }

          // Handle jsonPath in the key
          if (key.startsWith('jsonPath(')) {
              const pathMatch = key.match(/jsonPath\(\$,\s*['"](.+)['"]\)/);
              if (pathMatch) {
                  const path = pathMatch[1];
                  const actualKey = this.evaluateJSONPath(path, data);
                  if (actualKey !== null && actualKey !== undefined) {
                      result[actualKey] = this.resolveValue(value, data);
                  }
              }
              continue;
          }

          // Handle regular keys
          result[key] = this.resolveValue(value, data);
      }

      return result;
  } catch (error) {
      console.error('Error in mapper:', error);
      return null;
  }
}

resolveValue(value, data) {
  if (typeof value !== 'string') {
      return value;
  }

  // Handle jsonPath expression
  if (value.startsWith('jsonPath(')) {
      const pathMatch = value.match(/jsonPath\(\$,\s*['"](.+)['"]\)/);
      if (pathMatch) {
          return this.evaluateJSONPath(pathMatch[1], data);
      }
  }

  // Handle direct path expression
  if (value.startsWith('$')) {
      return this.evaluateJSONPath(value, data);
  }

  return value;
}
handleOperators(expression) {
  try {
      // Handle arithmetic operators first
      const arithmeticRegex = /([^+\-*/=!<>]+)([\+\-\*\/])([^+\-*/=!<>]+)/;
      const arithmeticMatch = expression.match(arithmeticRegex);
      
      if (arithmeticMatch) {
          const [, left, operator, right] = arithmeticMatch;
          return this.evaluateArithmetic(
              this.normalizeOperand(left.trim()),
              operator,
              this.normalizeOperand(right.trim())
          );
      }

      // Handle comparison operators
      const comparisonRegex = /([^=!<>]+)([=!]=|===|!==|[<>]=?)([^=!<>]+)/;
      const comparisonMatch = expression.match(comparisonRegex);

      if (comparisonMatch) {
          const [, left, operator, right] = comparisonMatch;
          return this.evaluateComparison(
              this.normalizeOperand(left.trim()),
              operator,
              this.normalizeOperand(right.trim())
          );
      }

      // If no operator found, return normalized value
      return this.normalizeOperand(expression);
  } catch (error) {
      console.error('Error in operator evaluation:', error);
      return null;
  }
}

evaluateArithmetic(left, operator, right) {
  // Convert operands to numbers
  const numLeft = Number(left);
  const numRight = Number(right);

  // Check if conversion was successful
  if (isNaN(numLeft) || isNaN(numRight)) {
      throw new Error('Invalid numeric operands');
  }

  switch (operator) {
      case '+':
          return numLeft + numRight;
      case '-':
          return numLeft - numRight;
      case '*':
          return numLeft * numRight;
      case '/':
          if (numRight === 0) throw new Error('Division by zero');
          return numLeft / numRight;
      default:
          throw new Error(`Unsupported arithmetic operator: ${operator}`);
  }
}

evaluateComparison(left, operator, right) {
  switch (operator) {
      case '===':
          return left === right;
      case '!==':
          return left !== right;
      case '==':
          return left == right;
      case '!=':
          return left != right;
      case '>':
          return left > right;
      case '>=':
          return left >= right;
      case '<':
          return left < right;
      case '<=':
          return left <= right;
      default:
          throw new Error(`Unsupported comparison operator: ${operator}`);
  }
}

normalizeOperand(operand) {
  if (typeof operand !== 'string') return operand;
  
  operand = operand.trim();

  // Handle JSONPath expressions
  if (operand.startsWith('$')) {
      return this.evaluateJSONPath(operand, this.context);
  }

  // Handle string literals
  if (operand.startsWith('"') || operand.startsWith("'")) {
      return operand.slice(1, -1);
  }

  // Handle numbers
  if (!isNaN(operand)) {
      return Number(operand);
  }

  return operand;
}
handleGlobalFunctions(functionName, args) {
  try {
      switch (functionName.toLowerCase()) {
          // URI Functions
          case 'decodeuricomponent':
              return decodeURIComponent(String(args[0]));

          case 'encodeuricomponent':
              return encodeURIComponent(String(args[0]));

          // Evaluation Function
          case 'eval':
              try {
                  return new Function('return ' + args[0])();
              } catch (e) {
                  console.error('Eval error:', e);
                  return null;
              }

          // Type Checking Functions
          case 'instanceof':
              const [obj, type] = args;
              switch (type.toLowerCase()) {
                  case 'null': return obj === null;
                  case 'boolean': return typeof obj === 'boolean';
                  case 'string': return typeof obj === 'string';
                  case 'number': return typeof obj === 'number';
                  case 'object': return typeof obj === 'object' && !Array.isArray(obj);
                  case 'array': return Array.isArray(obj);
                  case 'date': return obj instanceof Date;
                  default: return false;
              }

          case 'isnan':
              return isNaN(args[0]);

          case 'typeof':
              const value = args[0];
              if (Array.isArray(value)) return 'array';
              return typeof value;

          // Number Parsing Functions
          case 'parsefloat':
              return parseFloat(String(args[0]));

          case 'parseint':
              const [numStr, radix] = args;
              return parseInt(String(numStr), radix || 10);

          // JSONPath Function
          case 'jsonpath':
              const [obj, path] = args;
              try {
                  const result = this.evaluateJSONPath(path, obj);
                  if (result === undefined || result === null) {
                      throw new Error(`Path not found: ${path}`);
                  }
                  return result;
              } catch (e) {
                  throw new Error(`JSONPath error: ${e.message}`);
              }

          // Boolean Constants
          case 'true':
              return true;

          case 'false':
              return false;

          case 'null':
              return null;

          default:
              throw new Error(`Unknown function: ${functionName}`);
      }
  } catch (error) {
      console.error(`Error in global function ${functionName}:`, error);
      return null;
  }
}
handleNestedFunctionCalls(expression) {
  try {
      // Regular expression to match function calls with their arguments
      const functionRegex = /(\w+)\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/g;
      
      // Stack to handle nested function processing
      let stack = [];
      let lastIndex = 0;
      let result = expression;

      // Process all function calls from innermost to outermost
      while (true) {
          let matches = [...result.matchAll(functionRegex)];
          if (matches.length === 0) break;

          // Process innermost functions first
          for (const match of matches) {
              const [fullMatch, funcName, args] = match;
              
              // Skip if this function call contains other function calls
              if (functionRegex.test(args)) continue;

              // Process arguments
              const processedArgs = this.processArguments(args);
              
              // Execute the function
              const functionResult = this.executeSingleFunction(funcName, processedArgs);
              
              // Replace the function call with its result
              result = result.replace(fullMatch, this.stringifyResult(functionResult));
          }
      }

      // Handle any remaining direct values
      return this.parseResult(result);
  } catch (error) {
      console.error('Error in nested function processing:', error);
      return null;
  }
}

processArguments(argsString) {
  if (!argsString.trim()) return [];

  const args = [];
  let currentArg = '';
  let inString = false;
  let stringChar = '';
  let parenthesesCount = 0;

  for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i];

      if ((char === '"' || char === "'") && argsString[i - 1] !== '\\') {
          if (!inString) {
              inString = true;
              stringChar = char;
          } else if (stringChar === char) {
              inString = false;
          }
          currentArg += char;
      } else if (char === '(' && !inString) {
          parenthesesCount++;
          currentArg += char;
      } else if (char === ')' && !inString) {
          parenthesesCount--;
          currentArg += char;
      } else if (char === ',' && !inString && parenthesesCount === 0) {
          args.push(currentArg.trim());
          currentArg = '';
      } else {
          currentArg += char;
      }
  }

  if (currentArg.trim()) {
      args.push(currentArg.trim());
  }

  return args.map(arg => this.parseArgument(arg));
}

parseArgument(arg) {
  // Handle JSONPath expressions
  if (typeof arg === 'string' && arg.startsWith('$')) {
      return this.evaluateJSONPath(arg, this.context);
  }

  // Handle string literals
  if ((arg.startsWith('"') && arg.endsWith('"')) || 
      (arg.startsWith("'") && arg.endsWith("'"))) {
      return arg.slice(1, -1);
  }

  // Handle numbers
  if (!isNaN(arg)) {
      return Number(arg);
  }

  // Handle booleans
  if (arg === 'true') return true;
  if (arg === 'false') return false;
  if (arg === 'null') return null;

  return arg;
}

executeSingleFunction(functionName, args) {
  // Call the appropriate handler based on function name
  switch (functionName.toLowerCase()) {
      case 'trim':
      case 'upper':
      case 'lower':
      case 'concat':
      case 'substring':
          return this.handleGlobalFunctions(functionName, args);
          
      case 'round':
      case 'floor':
      case 'ceil':
      case 'abs':
          return this.handleGlobalFunctions(functionName, args);
          
      case 'jsonpath':
          return this.handleGlobalFunctions(functionName, args);
          
      // Add other function categories as needed
      default:
          throw new Error(`Unknown function: ${functionName}`);
  }
}

stringifyResult(result) {
  if (result === null || result === undefined) return 'null';
  if (typeof result === 'string') return `"${result}"`;
  if (Array.isArray(result)) return JSON.stringify(result);
  return String(result);
}

parseResult(result) {
  try {
      return JSON.parse(result);
  } catch {
      return result;
  }
}



  }

// Export the class
export default SnapLogicFunctionHandler;