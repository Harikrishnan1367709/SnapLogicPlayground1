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
      length: (arr) => Array.isArray(arr) ? arr.length : 0,
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

  handleArrayOperation(script, data) {
    // Updated regex to handle multiline object mapping
    const match = script.match(/\$array\.(\w+)\(([\s\S]*)\)/);
    if (!match) throw new Error('Invalid array function syntax');
  
    const [, functionName, argsString] = match;
    
    if (functionName === 'map') {
      // Find the first comma that's not inside an object literal
      let depth = 0;
      let commaIndex = -1;
      for (let i = 0; i < argsString.length; i++) {
        if (argsString[i] === '{') depth++;
        if (argsString[i] === '}') depth--;
        if (argsString[i] === ',' && depth === 0) {
          commaIndex = i;
          break;
        }
      }
  
      const arrayPath = argsString.substring(0, commaIndex).trim();
      const mapper = argsString.substring(commaIndex + 1).trim();
      const sourceArray = this.handleJSONPath(arrayPath, data);
  
      // Handle object mapping with proper JSON parsing
      if (mapper.startsWith('{')) {
        const mappingObj = JSON.parse(mapper);
        return sourceArray.map(item => {
          const result = {};
          Object.entries(mappingObj).forEach(([key, value]) => {
            result[key] = item[value];
          });
          return result;
        });
      }
  
      // Handle simple property mapping
      if (mapper.match(/^["'].*["']$/)) {
        const prop = mapper.replace(/['"]/g, '');
        return sourceArray.map(item => item[prop]);
      }
    }
  
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
