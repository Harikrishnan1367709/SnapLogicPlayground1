import { JSONPath } from 'jsonpath-plus';
import moment from 'moment';
import _ from 'lodash';

class SnapLogicFunctionsHandler {
  constructor() {
    this.stringFunctions = {
      toLowerCase: (str) => String(str).toLowerCase(),
      toUpperCase: (str) => String(str).toUpperCase(),
      concat: (...args) => args.join(''),
      substring: (str, start, end) => str.substring(start, end),
      trim: (str) => str.trim(),
      replace: (str, search, replace) => str.replace(search, replace),
      split: (str, separator) => str.split(separator),
      length: (str) => str.length
    };

    this.arrayFunctions = {
      length: (arr) => arr.length,
      distinct: (arr) => Array.from(new Set(arr)),
      join: (arr, separator) => arr.join(separator),
      first: (arr) => arr[0],
      last: (arr) => arr[arr.length - 1],
      map: (arr, mapping) => {
        if (!Array.isArray(arr)) return [];
        
        // Handle simple string mapping
        if (typeof mapping === 'string') {
          return arr.map(item => item[mapping]);
        }
        
        // Handle string operations in function mapping
        if (typeof mapping === 'string' && mapping.includes('$string.')) {
          return arr.map(item => {
            const [, method] = mapping.match(/\$string\.(\w+)/);
            return this.stringFunctions[method](item);
          });
        }
        
        // Handle arrow function with string operations
        if (mapping.toString().includes('$string.')) {
          return arr.map(item => {
            const methodMatch = mapping.toString().match(/\$string\.(\w+)/);
            if (methodMatch) {
              const [, method] = methodMatch;
              return this.stringFunctions[method.toLowerCase()](item);
            }
            return item;
          });
        }
        
        // Handle object mapping
        if (typeof mapping === 'object') {
          return arr.map(item => {
            const result = {};
            Object.entries(mapping).forEach(([key, value]) => {
              if (typeof value === 'string') {
                if (value.startsWith('$string.')) {
                  const [, method] = value.match(/\$string\.(\w+)/);
                  result[key] = this.stringFunctions[method](item[key]);
                } else {
                  result[key] = item[value];
                }
              } else {
                result[key] = value;
              }
            });
            return result;
          });
        }
        
        return arr;
      },
      filter: (arr, predicate) => {
        if (!Array.isArray(arr)) return [];
        return arr.filter(item => {
          if (typeof predicate === 'function') {
            return predicate(item);
          }
          if (typeof predicate === 'string') {
            return !!item[predicate];
          }
          return false;
        });
      }
    };

    this.dateFunctions = {
      now: () => moment().format(),
      format: (date, format) => moment(date).format(format),
      add: (date, amount, unit) => moment(date).add(amount, unit).format(),
      subtract: (date, amount, unit) => moment(date).subtract(amount, unit).format(),
      diff: (date1, date2, unit) => moment(date1).diff(moment(date2), unit)
    };

    this.mathFunctions = {
      round: Math.round,
      ceil: Math.ceil,
      floor: Math.floor,
      abs: Math.abs,
      max: Math.max,
      min: Math.min,
      pow: Math.pow,
      sqrt: Math.sqrt
    };
  }

  executeScript(script, data) {
    if (!script) return null;

    try {
      if (script === '$') {
        return data;
      }

      if (script.includes('$string.')) {
        return this.handleStringFunction(script, data);
      }

      if (script.includes('$array.')) {
        return this.handleArrayFunction(script, data);
      }

      if (script.includes('$date.')) {
        return this.handleDateFunction(script, data);
      }

      if (script.includes('$math.')) {
        return this.handleMathFunction(script, data);
      }

      return this.handleJSONPath(script, data);
    } catch (error) {
      throw new Error(`Script execution failed: ${error.message}`);
    }
  }

  handleStringFunction(script, data) {
    const match = script.match(/\$string\.(\w+)\((.*)\)/);
    if (!match) throw new Error('Invalid string function syntax');

    const [, functionName, args] = match;
    const evaluatedArgs = this.evaluateArguments(args, data);
    return this.stringFunctions[functionName](...evaluatedArgs);
  }

 // ... existing code ...

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

// ... existing code ...
  
  

  handleDateFunction(script, data) {
    const match = script.match(/\$date\.(\w+)\((.*)\)/);
    if (!match) throw new Error('Invalid date function syntax');

    const [, functionName, args] = match;
    const evaluatedArgs = this.evaluateArguments(args, data);
    return this.dateFunctions[functionName](...evaluatedArgs);
  }

  handleMathFunction(script, data) {
    const match = script.match(/\$math\.(\w+)\((.*)\)/);
    if (!match) throw new Error('Invalid math function syntax');

    const [, functionName, args] = match;
    const evaluatedArgs = this.evaluateArguments(args, data);
    return this.mathFunctions[functionName](...evaluatedArgs);
  }

  handleJSONPath(script, data) {
    const result = JSONPath({ path: script, json: data });
    return result.length === 1 ? result[0] : result;
  }

  evaluateArguments(argsString, data) {
    if (!argsString) return [];
  
    // Handle arrow functions in map operations
    if (argsString.includes('=>')) {
      const [arrayPath, mapFunction] = argsString.split(',').map(arg => arg.trim());
      const arrayData = arrayPath.startsWith('$.') 
        ? this.handleJSONPath(arrayPath, data)
        : arrayPath;
  
      if (mapFunction.includes('$string.')) {
        const methodMatch = mapFunction.match(/\$string\.(\w+)/);
        if (methodMatch) {
          const [, method] = methodMatch;
          return [arrayData, item => this.stringFunctions[method.toLowerCase()](item)];
        }
      }
    }
  
    // Regular argument handling
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
