import { JSONPath } from 'jsonpath-plus';
import moment from 'moment';
import _ from 'lodash';

class SnapLogicFunctionsHandler {
  constructor() {
    this.stringFunctions = {
      camelCase: (str) => str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()),
      capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
      charAt: (str, index) => str.charAt(index),
      charCodeAt: (str, index) => str.charCodeAt(index),
      concat: (...args) => args.join(''),
      contains: (str, search) => str.includes(search),
      endsWith: (str, search) => str.endsWith(search),
      indexOf: (str, search) => str.indexOf(search),
      kebabCase: (str) => str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`).replace(/^-/, ''),
      lastIndexOf: (str, search) => str.lastIndexOf(search),
      length: (str) => str.length,
      localeCompare: (str, compareStr) => str.localeCompare(compareStr),
      toLowerCase: (str) => str.toLowerCase(),
      toUpperCase: (str) => str.toUpperCase(),
      trim: (str) => str.trim(),
      trimLeft: (str) => str.trimStart(),
      trimRight: (str) => str.trimEnd(),
      replace: (str, search, replacement) => str.replace(search, replacement),
      replaceAll: (str, search, replacement) => str.replaceAll(search, replacement),
      split: (str, separator) => str.split(separator),
      substring: (str, start, end) => str.substring(start, end),
      substr: (str, start, length) => str.substr(start, length)
    };

    this.arrayFunctions = {
      filter: (arr, predicate) => arr.filter(predicate),
      find: (arr, predicate) => arr.find(predicate),
      findIndex: (arr, predicate) => arr.findIndex(predicate),
      concat: (arr1, arr2) => arr1.concat(arr2),
      map: (arr, mapper) => arr.map(mapper),
      indexOf: (arr, value) => arr.indexOf(value),
      lastIndexOf: (arr, value) => arr.lastIndexOf(value),
      join: (arr, separator) => arr.join(separator),
      reduce: (arr, reducer, initial) => arr.reduce(reducer, initial),
      reduceRight: (arr, reducer, initial) => arr.reduceRight(reducer, initial),
      reverse: (arr) => [...arr].reverse(),
      sort: (arr) => [...arr].sort(),
      slice: (arr, start, end) => arr.slice(start, end),
      splice: (arr, start, deleteCount, ...items) => {
        const copy = [...arr];
        copy.splice(start, deleteCount, ...items);
        return copy;
      },
      unique: (arr) => [...new Set(arr)],
      groupBy: (arr, key) => _.groupBy(arr, key),
      sortBy: (arr, key) => _.sortBy(arr, key)
    };

    this.dateFunctions = {
      now: () => new Date(),
      parse: Date.parse,
      UTC: Date.UTC,
      plus: {
        days: (date, n) => moment(date).add(n, 'days').toDate(),
        hours: (date, n) => moment(date).add(n, 'hours').toDate(),
        minutes: (date, n) => moment(date).add(n, 'minutes').toDate(),
        months: (date, n) => moment(date).add(n, 'months').toDate(),
        years: (date, n) => moment(date).add(n, 'years').toDate()
      },
      minus: {
        days: (date, n) => moment(date).subtract(n, 'days').toDate(),
        hours: (date, n) => moment(date).subtract(n, 'hours').toDate(),
        minutes: (date, n) => moment(date).subtract(n, 'minutes').toDate(),
        months: (date, n) => moment(date).subtract(n, 'months').toDate(),
        years: (date, n) => moment(date).subtract(n, 'years').toDate()
      },
      format: (date, format) => moment(date).format(format),
      get: {
        date: (date) => date.getDate(),
        day: (date) => date.getDay(),
        year: (date) => date.getFullYear(),
        month: (date) => date.getMonth(),
        hours: (date) => date.getHours(),
        minutes: (date) => date.getMinutes(),
        seconds: (date) => date.getSeconds(),
        milliseconds: (date) => date.getMilliseconds()
      }
    };

    this.mathFunctions = {
      abs: Math.abs,
      ceil: Math.ceil,
      floor: Math.floor,
      min: Math.min,
      max: Math.max,
      pow: Math.pow,
      random: Math.random,
      round: Math.round,
      sign: Math.sign,
      trunc: Math.trunc,
      sqrt: Math.sqrt
    };

    this.objectFunctions = {
      entries: Object.entries,
      keys: Object.keys,
      values: Object.values,
      merge: Object.assign,
      get: (obj, path) => _.get(obj, path),
      hasPath: (obj, path) => _.has(obj, path),
      isEmpty: (obj) => _.isEmpty(obj),
      pick: (obj, paths) => _.pick(obj, paths),
      omit: (obj, paths) => _.omit(obj, paths)
    };
  }

  executeScript(script, data) {
    if (!script) return null;

    try {
      if (script === '```') {
        return data;
      }

      if (script.includes('$string.')) {
        return this.handleStringOperation(script, data);
      }

      if (script.includes('$array.')) {
        return this.handleArrayOperation(script, data);
      }

      if (script.includes('$date.')) {
        return this.handleDateOperation(script, data);
      }

      if (script.includes('$math.')) {
        return this.handleMathOperation(script, data);
      }

      if (script.includes('$object.')) {
        return this.handleObjectOperation(script, data);
      }

      return this.handleJSONPath(script, data);
    } catch (error) {
      throw new Error(`Script execution failed: ${error.message}`);
    }
  }

  handleStringOperation(script, data) {
    const match = script.match(/\$string\.(\w+)\((.*)\)/);
    if (!match) throw new Error('Invalid string function syntax');

    const [, functionName, args] = match;
    const evaluatedArgs = this.evaluateArguments(args, data);
    return this.stringFunctions[functionName](...evaluatedArgs);
  }

  handleArrayFunction(script, data) {
    const match = script.match(/\$array\.(\w+)\((.*)\)/);
    if (!match) throw new Error('Invalid array function syntax');
  
    const [, functionName, argsString] = match;
    
    if (functionName === 'map') {
      const [arrayPath, mapper] = argsString.split(',').map(arg => arg.trim());
      const sourceArray = this.handleJSONPath(arrayPath, data);
  
      // Case 1: Simple property mapping
      if (mapper.match(/^["'].*["']$/)) {
        const prop = mapper.replace(/['"]/g, '');
        return sourceArray.map(item => item[prop]);
      }
  
      // Case 2: Object mapping
      if (mapper.startsWith('{')) {
        try {
          const mappingObj = eval(`(${mapper})`);
          return sourceArray.map(item => {
            const result = {};
            Object.entries(mappingObj).forEach(([key, value]) => {
              result[key] = item[value];
            });
            return result;
          });
        } catch (error) {
          throw new Error('Invalid object mapping syntax');
        }
      }
  
      // Case 3: String operation with arrow function
      if (mapper.includes('=>')) {
        // Handle both (x) => and x => formats
        const arrowMatch = mapper.match(/(?:\((.*?)\)|(\w+))\s*=>\s*(.+)/);
        if (arrowMatch) {
          const [, paramWithParen, simpleParam, body] = arrowMatch;
          const param = (paramWithParen || simpleParam).trim();
  
          if (body.includes('$string.')) {
            const stringMatch = body.match(/\$string\.(\w+)\((.*?)\)/);
            if (stringMatch) {
              const [, method, args] = stringMatch;
              // If args is just the parameter name, directly use the item
              if (args.trim() === param) {
                return sourceArray.map(item => 
                  this.stringFunctions[method.toLowerCase()](item)
                );
              }
            }
          }
        }
      }
    }
  
    // Default case: use array functions
    return this.arrayFunctions[functionName](...this.evaluateArguments(argsString, data));
  }

  handleDateOperation(script, data) {
    const match = script.match(/\$date\.(\w+)\.?(\w+)?\((.*)\)/);
    if (!match) throw new Error('Invalid date function syntax');

    const [, category, method, args] = match;
    const evaluatedArgs = this.evaluateArguments(args, data);

    if (method) {
      return this.dateFunctions[category][method](...evaluatedArgs);
    }
    return this.dateFunctions[category](...evaluatedArgs);
  }

  handleMathOperation(script, data) {
    const match = script.match(/\$math\.(\w+)\((.*)\)/);
    if (!match) throw new Error('Invalid math function syntax');

    const [, functionName, args] = match;
    const evaluatedArgs = this.evaluateArguments(args, data);
    return this.mathFunctions[functionName](...evaluatedArgs);
  }

  handleObjectOperation(script, data) {
    const match = script.match(/\$object\.(\w+)\((.*)\)/);
    if (!match) throw new Error('Invalid object function syntax');

    const [, functionName, args] = match;
    const evaluatedArgs = this.evaluateArguments(args, data);
    return this.objectFunctions[functionName](...evaluatedArgs);
  }

  handleJSONPath(script, data) {
    const result = JSONPath({ path: script, json: data });
    return result.length === 1 ? result[0] : result;
  }

  evaluateArguments(argsString, data) {
    if (!argsString) return [];
    
    return argsString.split(',').map(arg => {
      arg = arg.trim();
      if (arg.startsWith('$.')) {
        return this.handleJSONPath(arg, data);
      }
      if (arg.startsWith('"') || arg.startsWith("'")) {
        return arg.slice(1, -1);
      }
      if (!isNaN(arg)) {
        return Number(arg);
      }
      return arg;
    });
  }
}

export default SnapLogicFunctionsHandler;
