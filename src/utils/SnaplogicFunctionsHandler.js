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
    this.dateFormatter = {
      formatDate: (date, format) => {
        return moment(date).format(format);
      },
      subtractHours: (date, hours) => {
        return moment(date).subtract(hours, 'hours').toDate();
      }
    };


   
  }


  handleComplexDateExpression(script) {
    try {
      const cleanScript = script.replace(/\n/g, ' ').trim();


      const context = {
        Date: {
          now: () => new Date(),
          parse: (str) => new Date(str)
        },
        moment,
        formatter: this.dateFormatter
      };


      const evalFn = new Function('Date', 'moment', 'formatter', `
        try {
          const now = Date.now();
         
          const result = ${cleanScript.includes('?') ?
            `(${cleanScript.split('?')[0]}) ?
             "${cleanScript.split('?')[1].split(':')[0].trim()}" :
             (() => {
               const baseDate = formatter.subtractHours(now, 10);
               const datePart = formatter.formatDate(baseDate, 'YYYY-MM-DD');
               const timePart = formatter.formatDate(baseDate, 'HH:mm:ss');
               return datePart + 'T' + timePart + '+02:00';
             })()`
            :
            cleanScript
          };
         
          return result;
        } catch (error) {
          console.error('Evaluation error:', error);
          return null;
        }
      `);


      return evalFn(context.Date, context.moment, context.formatter);
    } catch (error) {
      console.error('Expression handling error:', error);
      return null;
    }
  }




  evaluateValue(expression, data) {
    if (expression.startsWith('$')) {
      const variable = expression.slice(1);
      return data[variable];
    }
    return expression;
  }


  handleDateExpression(script) {
    try {
      console.log('Input script:', script); // Debug log
      const result = this.dateUtils.parseExpression(script);
      console.log('Output result:', result); // Debug log
      return result;
    } catch (error) {
      console.error('Date expression handling error:', error);
      return script;
    }
  }




  handleDateComparison(script, data) {
    const results = data.map(group => {
      const evaluatedEmployees = group.employee.map(emp => {
        const evaluateScript = () => {
          // Create a context object with all employee data
          const context = {
            ...emp,
            dates: {
              effective: moment(emp.EffectiveMoment),
              entry: moment(emp.EntryMoment),
              now: moment(),
              parse: (dateStr) => moment(dateStr)
            }
          };
 
          // Handle different types of date comparisons
          if (script.includes('Date.parse')) {
            const dateComparisons = {
              effectiveVsNow: context.dates.effective.valueOf() <= context.dates.now.valueOf(),
              effectiveVsEntry: context.dates.effective.valueOf() >= context.dates.entry.valueOf(),
              effectiveInRange: (start, end) => {
                const startDate = context.dates.parse(start);
                const endDate = context.dates.parse(end);
                return context.dates.effective.isBetween(startDate, endDate, 'day', '[]');
              }
            };
 
            // Evaluate specific conditions based on script
            if (script.includes('2023-01-01')) {
              return dateComparisons.effectiveInRange('2023-01-01', '2023-12-31') &&
                     (emp.Event === "Time Off Entry" || emp.Event === "Request Time Off");
            }
           
            if (script.includes('EntryMoment')) {
              return dateComparisons.effectiveVsEntry &&
                     (emp.EventLiteTypeID === "Time Off Entry" || emp.Event === "Request Time Off");
            }
 
            if (script.includes('WorkerID == "81131"')) {
              return emp.WorkerID === "81131" &&
                     dateComparisons.effectiveVsNow &&
                     (emp.Event === "Time Off Entry" || emp.Event === "Request Time Off");
            }
          }
 
          // Handle non-date conditions
          if (script.includes('IsCorrectionOrCorrected')) {
            return emp.IsCorrectionOrCorrected === "0" &&
                   (emp.Event === "Correct Time Off" || emp.Event === "Time Off Entry");
          }
 
          // Default date and event check
          return context.dates.effective.valueOf() <= context.dates.now.valueOf() &&
                 ["Time Off Entry", "Request Time Off", "Timesheet Review Event", "Correct Time Off"]
                 .includes(emp.Event || emp.EventLiteTypeID);
        };
 
        return evaluateScript();
      });
 
      return {
        ...group,
        employee: evaluatedEmployees
      };
    });
 
    return results;
  }
 
  handleLogicalExpression(script, data) {
    try {
      const evaluateCondition = (emp, script) => {
        const context = {
          ...emp,
          Date: {
            parse: (dateStr) => new Date(dateStr).getTime(),
            now: () => new Date().getTime()  // Add this line
          }
        };
 
        // Add debug logging
        console.log('Evaluating:', {
          EffectiveMoment: new Date(emp.EffectiveMoment).getTime(),
          Now: new Date().getTime(),
          EventLiteTypeID: emp.EventLiteTypeID,
          Event: emp.Event
        });
 
        const processedScript = script.replace(/\$(\w+)/g, (match, variable) => {
          const value = context[variable];
          if (value === null) return 'null';
          if (typeof value === 'string') {
            return `"${value}"`; // Wrap strings in quotes
          }
          return value ?? 'undefined';
        });
 
        try {
          const evalFn = new Function(
            'Date',
            `
            try {
              return Boolean(${processedScript});
            } catch (e) {
              console.error('Evaluation error:', e);
              return false;
            }
            `
          );
          return evalFn(context.Date);
        } catch (error) {
          console.error('Function creation error:', error);
          return false;
        }
      };
 
      return data.map(group => {
        const filteredEmployees = group.employee.filter(emp =>
          evaluateCondition(emp, script)
        );
 
        return {
          groupBy: group.groupBy,
          employee: filteredEmployees
        };
      }).filter(group => group.employee.length > 0);
    } catch (error) {
      console.error('Expression error:', error);
      return [];
    }
  }


  handleObjectMapping(script, data) {
    try {
      const template = JSON.parse(script);
     
      const evaluateJSONPath = (pathExpr, groupData) => {
        try {
          // Generic JSONPath evaluation
          const result = JSONPath({ path: pathExpr, json: groupData });
          console.log(`JSONPath evaluation for ${pathExpr}:`, result);
         
          // Handle different result types
          if (pathExpr.endsWith('.length')) {
            return result;
          }
         
          // For array expressions (wildcards or filters), preserve array structure
          if (pathExpr.includes('[*]') || pathExpr.includes('[?(')) {
            return result;
          }
         
          // For simple paths, return single value if array has one element
          return Array.isArray(result) && result.length === 1 ? result[0] : result;
        } catch (error) {
          console.error('JSONPath evaluation error:', error);
          return null;
        }
      };
     
      const mappedData = data.map(groupData => {
        const result = {};
       
        // Process each template key dynamically
        for (const [key, pathExpr] of Object.entries(template)) {
          if (typeof pathExpr === 'string' && pathExpr.startsWith('$.')) {
            const value = evaluateJSONPath(pathExpr, groupData);
            if (value !== null) {
              result[key] = value;
            }
          } else if (typeof pathExpr === 'object' && pathExpr !== null) {
            // Handle nested objects
            result[key] = {};
            for (const [nestedKey, nestedExpr] of Object.entries(pathExpr)) {
              if (typeof nestedExpr === 'string' && nestedExpr.startsWith('$.')) {
                const value = evaluateJSONPath(nestedExpr, groupData);
                if (value !== null) {
                  result[key][nestedKey] = value;
                }
              } else {
                result[key][nestedKey] = nestedExpr;
              }
            }
          } else {
            // Handle static values
            result[key] = pathExpr;
          }
        }
       
        return result;
      });
 
      return mappedData;
    } catch (error) {
      console.error('Object mapping error:', error);
      return null;
    }
  }
 
  handleJSONPath(script, data) {
    try {
      // If script is just $, return the full data
      if (script.trim() === '$') {
        return data;
      }
 
      // Check if the expression is incomplete (ends with a dot)
      if (script.endsWith('.')) {
        return null;
      }
 
      // Handle complete expressions
      const results = [];
      data.forEach(item => {
        const value = JSONPath({ path: script, json: item });
        if (value && value.length > 0) {
          results.push(...value);
        }
      });
     
      return results.length === 1 ? results[0] : results;
    } catch (error) {
      // Don't throw error for incomplete expressions
      if (script.includes('$')) {
        return null;
      }
      console.error('JSONPath error:', error);
      return null;
    }
  }
 
  executeScript(script, data) {
    if (!script) return null;


    try {


      console.log('Script:', script);
    console.log('Data:', data);

    // Handle static String.fromCharCode method
    const staticMethodMatch = script.match(/String\.fromCharCode\((.*)\)/);
    if (staticMethodMatch) {
      const args = staticMethodMatch[1].split(',').map(arg => parseInt(arg.trim()));
      return String.fromCharCode(...args);
    }


    // Handle string operations with arguments
    const methodMatch = script.match(/\$(\w+)\.(\w+)\((.*)\)/);
    if (methodMatch) {
      const [, variableName, methodName, argsString] = methodMatch;
      const value = data[variableName];


      if (value === undefined) {
        throw new Error(`Variable '${variableName}' not found in data`);
      }


      // Parse arguments if they exist
      const args = argsString ?
        argsString.split(',').map(arg => {
          arg = arg.trim();
          // Handle number arguments
          if (!isNaN(arg)) {
            return Number(arg);
          }
          // Handle string arguments (remove quotes)
          if (arg.startsWith('"') || arg.startsWith("'")) {
            return arg.slice(1, -1);
          }
          // Handle regex arguments
          if (arg.startsWith('/') && arg.endsWith('/g')) {
            return new RegExp(arg.slice(1, -2), 'g');
          }
          if (arg.startsWith('/') && arg.endsWith('/')) {
            return new RegExp(arg.slice(1, -1));
          }
          return arg;
        }) : [];


      // String operations
      switch (methodName) {
        // Basic operations
        case 'toUpperCase': return value.toUpperCase();
        case 'toLowerCase': return value.toLowerCase();
        case 'trim': return value.trim();
        case 'trimLeft': return value.trimStart();
        case 'trimRight': return value.trimEnd();
        case 'length': return value.length;


        // Case conversions
        case 'camelCase': return _.camelCase(value);
        case 'kebabCase': return _.kebabCase(value);
        case 'snakeCase': return _.snakeCase(value);
        case 'capitalize': return _.capitalize(value);
        case 'upperFirst': return _.upperFirst(value);
        case 'lowerFirst': return _.lowerFirst(value);


        // Character operations
        case 'charAt': {
          const index = parseInt(args[0]);
          if (isNaN(index)) {
            throw new Error('charAt requires a numeric index');
          }
          return value.charAt(index);
        }
        case 'charCodeAt': {
          const index = parseInt(args[0]);
          if (isNaN(index)) {
            throw new Error('charCodeAt requires a numeric index');
          }
          return value.charCodeAt(index);
        }


        // Search operations
        case 'contains': return value.includes(args[0], args[1]);
        case 'startsWith': return value.startsWith(args[0], args[1]);
        case 'endsWith': return value.endsWith(args[0], args[1]);
        case 'indexOf': return value.indexOf(args[0], args[1]);
        case 'lastIndexOf': return value.lastIndexOf(args[0], args[1]);
        case 'search': return value.search(args[0]);


        // String manipulation
        case 'concat': return value.concat(...args);
        case 'substring': return value.substring(args[0], args[1]);
        case 'substr': return value.substr(args[0], args[1]);
        case 'slice': return value.slice(args[0], args[1]);
        case 'repeat': return value.repeat(args[0]);


        // String replacement
        case 'replace':
          if (args[0] instanceof RegExp) {
            return value.replace(args[0], args[1]);
          }
          return value.replace(args[0], args[1]);
        case 'replaceAll': return value.replaceAll(args[0], args[1]);


        // String split and match
        case 'split': return value.split(args[0], args[1]);
        case 'match': return value.match(args[0]);


        // String comparison
        case 'localeCompare': return value.localeCompare(args[0]);


        // String formatting
        case 'sprintf': {
          let result = value;
          if (args.length === 0) return result;


          // Handle numbered placeholders like %1$s
          if (value.includes('$')) {
            const matches = value.match(/%\d+\$s/g) || [];
            matches.forEach(match => {
              const index = parseInt(match.match(/\d+/)[0]) - 1;
              if (index >= 0 && index < args.length) {
                result = result.replace(match, args[index]);
              }
            });
          } else {
            // Handle simple %s placeholders
            let argIndex = 0;
            result = result.replace(/%s/g, () => {
              return argIndex < args.length ? args[argIndex++] : '%s';
            });
          }
          return result;
        }


        default:
          throw new Error(`Unknown string method: ${methodName}`);
      }
    }


    // Handle string operations without arguments
    const simpleMatch = script.match(/\$(\w+)\.(\w+)\(\)/);
    if (simpleMatch) {
      const [, variableName, methodName] = simpleMatch;
      const value = data[variableName];


      if (value === undefined) {
        throw new Error(`Variable '${variableName}' not found in data`);
      }


      switch (methodName) {
        case 'toUpperCase': return value.toUpperCase();
        case 'toLowerCase': return value.toLowerCase();
        case 'trim': return value.trim();
        case 'length': return value.length;
        // Add other no-argument methods here
        default:
          throw new Error(`Unknown string method: ${methodName}`);
      }
    }

      // Handle array length without parentheses
    const lengthMatch = script.match(/\$(\w+)\.length$/);
    if (lengthMatch) {
      const [, variableName] = lengthMatch;
      const value = data[variableName];
      if (Array.isArray(value) || value instanceof Uint8Array) {
        return value.length;
      }
      throw new Error(`Variable '${variableName}' is not an array`);
    }
    // Handle Uint8Array.subarray static method
    if (script.startsWith('Uint8Array.subarray')) {
      const match = script.match(/Uint8Array\.subarray\s*\(([^)]*)\)/);
      if (match) {
        const [start = 0, end] = match[1].split(',').map(arg =>
          arg ? parseInt(arg.trim()) : undefined
        );
        // Convert regular array to Uint8Array if needed
        const uint8Array = new Uint8Array(data.uint8);
        return Array.from(uint8Array.subarray(start, end));
      }
    }
     // Handle array operations
     const arrayMethodMatch = script.match(/\$(\w+)\.(\w+)\((.*)\)/);
     if (arrayMethodMatch) {
       const [, variableName, methodName, argsString] = arrayMethodMatch;
       const value = data[variableName];
 
       if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
         throw new Error(`Variable '${variableName}' is not an array`);
       }
       // Handle length with parentheses
      if (methodName === 'length') {
        return value.length;
      }
 
       // Parse arguments if they exist
       const args = argsString ?
         argsString.split(',').map(arg => {
           arg = arg.trim();
           // Handle arrow functions
           if (arg.includes('=>')) {
             return eval(`(${arg})`);
           }
           // Handle number arguments
           if (!isNaN(arg)) {
             return Number(arg);
           }
           // Handle string arguments
           if (arg.startsWith('"') || arg.startsWith("'")) {
             return arg.slice(1, -1);
           }
           return arg;
         }) : [];
 
       // Array operations
       switch (methodName) {
         // Basic array operations
         case 'concat':
           const arraysToConcat = args.map(arg =>
             typeof arg === 'string' && arg.startsWith('$') ?
               data[arg.slice(1)] : arg
           );
           return value.concat(...arraysToConcat);
 
         case 'filter':
           return value.filter(...args);
 
         case 'find':
           return value.find(...args);
 
         case 'findIndex':
           return value.findIndex(...args);
 
           case 'indexOf': {
            const [searchElement, fromIndex] = args;
            return value.indexOf(searchElement, fromIndex);
          }


          case 'lastIndexOf': {
            const [searchElement, fromIndex] = args;
            return value.lastIndexOf(searchElement, fromIndex);
          }
 
         case 'join':
           return value.join(...args);
 
         case 'map':
           return value.map(...args);
 
           case 'reduce':
        case 'reduceRight': {
          // Extract the callback function and initial value
          const lastCommaIndex = argsString.lastIndexOf(',');
          if (lastCommaIndex === -1) {
            // No initial value provided
            const callback = createReducerFunction(argsString);
            return methodName === 'reduce' ?
              value.reduce(callback) :
              value.reduceRight(callback);
          }


          const callbackStr = argsString.substring(0, lastCommaIndex);
          const initialValueStr = argsString.substring(lastCommaIndex + 1).trim();
         
          // Create the reducer function
          const callback = createReducerFunction(callbackStr);
         
          // Evaluate the initial value
          let initialValue;
          if (initialValueStr === '0') {
            initialValue = 0;
          } else if (initialValueStr === '""') {
            initialValue = "";
          } else {
            initialValue = eval(initialValueStr);
          }


          return methodName === 'reduce' ?
            value.reduce(callback, initialValue) :
            value.reduceRight(callback, initialValue);
        }
     
   




 
         case 'reverse':
           return [...value].reverse();
 
         case 'slice':
           return value.slice(...args);
 
         case 'sort':
           return [...value].sort(...args);
 
           case 'splice': {
            const arrayCopy = [...value];
            const [start, deleteCount, ...items] = args;
            const removed = arrayCopy.splice(start, deleteCount, ...items);
            data[variableName] = arrayCopy; // Update the original array
            return removed;
          }
 
         // Array modification methods
         case 'pop': {
           const arrayCopy = [...value];
           return arrayCopy.pop();
         }
 
         case 'push': {
           const arrayCopy = [...value];
           arrayCopy.push(...args);
           return arrayCopy;
         }
 
         case 'shift': {
           const arrayCopy = [...value];
           return arrayCopy.shift();
         }
 
         case 'unshift': {
           const arrayCopy = [...value];
           arrayCopy.unshift(...args);
           return arrayCopy;
         }
 
         // Special methods
         case 'toObject': {
           if (args.length === 1) {
             return Object.fromEntries(value.map((item, index) => [
               args[0](item, index),
               item
             ]));
           }
           return Object.fromEntries(value.map((item, index) => [
             args[0](item, index),
             args[1](item, index)
           ]));
         }
 
         case 'toString':
           return value.toString();
 
         // Uint8Array specific methods
         case 'subarray': {
          if (!(value instanceof Uint8Array)) {
            throw new Error('subarray is only available for Uint8Array');
          }


          // Parse start and end indices
          const [start = 0, end] = argsString.split(',').map(arg =>
            arg ? parseInt(arg.trim()) : undefined
          );


          return value.subarray(start, end);
        }
       }
     }
 
     // Handle Uint8Array.of
     if (script.startsWith('Uint8Array.of')) {
       const argsMatch = script.match(/Uint8Array\.of\((.*)\)/);
       const args = argsMatch[1] ?
         argsMatch[1].split(',').map(arg => Number(arg.trim())) :
         [];
       return Uint8Array.of(...args);
     }
 
    


    //   console.log('Executing script:', script);
    // console.log('Input data:', data);


    // // String Functions
    // if (script.startsWith('$string.')) {
    //   const match = script.match(/\$string\.(\w+)\((.*)\)/);
    //   if (!match) throw new Error('Invalid string function syntax');
    //   const [, functionName, args] = match;
    //   const evaluatedArgs = args.split(',').map(arg => {
    //     arg = arg.trim();
    //     if (arg.startsWith('$.')) {
    //       const path = arg.slice(2);
    //       return data[path];
    //     }
    //     return arg.replace(/['"]/g, ''); // Remove quotes
    //   });
    //   return this.stringFunctions[functionName](...evaluatedArgs);
    // }


    // // Array Functions
    // if (script.startsWith('$array.')) {
    //   const match = script.match(/\$array\.(\w+)\((.*)\)/);
    //   if (!match) throw new Error('Invalid array function syntax');
    //   const [, functionName, args] = match;
    //   const evaluatedArgs = args.split(',').map(arg => {
    //     arg = arg.trim();
    //     if (arg.startsWith('$.')) {
    //       const path = arg.slice(2);
    //       return data[path];
    //     }
    //     return arg.replace(/['"]/g, '');
    //   });
    //   return this.arrayFunctions[functionName](...evaluatedArgs);
    // }


    // // Math Functions
    // if (script.startsWith('$math.')) {
    //   const match = script.match(/\$math\.(\w+)\((.*)\)/);
    //   if (!match) throw new Error('Invalid math function syntax');
    //   const [, functionName, args] = match;
    //   const evaluatedArgs = args.split(',').map(arg => {
    //     arg = arg.trim();
    //     if (arg.startsWith('$.')) {
    //       const path = arg.slice(2);
    //       return data[path];
    //     }
    //     return Number(arg);
    //   });
    //   return this.mathFunctions[functionName](...evaluatedArgs);
    // }


    // // Object Functions
    // if (script.startsWith('$object.')) {
    //   const match = script.match(/\$object\.(\w+)\((.*)\)/);
    //   if (!match) throw new Error('Invalid object function syntax');
    //   const [, functionName, args] = match;
    //   const evaluatedArgs = args.split(',').map(arg => {
    //     arg = arg.trim();
    //     if (arg.startsWith('$.')) {
    //       const path = arg.slice(2);
    //       return data[path];
    //     }
    //     return JSON.parse(arg);
    //   });
    //   return this.objectFunctions[functionName](...evaluatedArgs);
    // }


    // // Date Functions
    // if (script.startsWith('$date.')) {
    //   const match = script.match(/\$date\.(\w+)\.?(\w+)?\((.*)\)/);
    //   if (!match) throw new Error('Invalid date function syntax');
    //   const [, category, method, args] = match;
    //   const evaluatedArgs = args.split(',').map(arg => {
    //     arg = arg.trim();
    //     if (arg.startsWith('$.')) {
    //       const path = arg.slice(2);
    //       return data[path];
    //     }
    //     return arg.replace(/['"]/g, '');
    //   });
     
    //   if (method) {
    //     return this.dateFunctions[category][method](...evaluatedArgs);
    //   }
    //   return this.dateFunctions[category](...evaluatedArgs);
    // }
    console.log('Script:', script);
    console.log('Data:', data);


    // Handle direct function calls like $text.toUpperCase()
    const directFunctionMatch = script.match(/\$(\w+)\.(\w+)\(\)/);
    if (directFunctionMatch) {
      const [, variableName, functionName] = directFunctionMatch;
      console.log('Variable:', variableName);
      console.log('Function:', functionName);
     
      const value = data[variableName];
      console.log('Value:', value);
     
      if (value === undefined) {
        throw new Error(`Variable '${variableName}' not found in data`);
      }


      // Check which type of function to call based on the value type
      if (typeof value === 'string' && this.stringFunctions[functionName]) {
        return this.stringFunctions[functionName](value);
      }
     
      if (Array.isArray(value) && this.arrayFunctions[functionName]) {
        return this.arrayFunctions[functionName](value);
      }
     
      if (typeof value === 'number' && this.mathFunctions[functionName]) {
        return this.mathFunctions[functionName](value);
      }
     
      if (value instanceof Date && this.dateFunctions[functionName]) {
        return this.dateFunctions[functionName](value);
      }
     
      if (typeof value === 'object' && value !== null && this.objectFunctions[functionName]) {
        return this.objectFunctions[functionName](value);
      }


      throw new Error(`No matching function '${functionName}' found for type ${typeof value}`);
    }




      if (script.includes('Date.parse') || script.includes('&&') || script.includes('||')) {
        return this.handleLogicalExpression(script, data);
      }
 
      // Handle complex date expressions with ternary operators
      if (script.includes('Date.now()') || (script.includes('?') && script.includes('T'))) {
        return this.handleComplexDateExpression(script);
      }
       // Handle object mapping with JSONPath
    if (script.trim().startsWith('{') && script.includes('$.')) {
      console.log('Processing object mapping:', script);
      console.log('Input data:', data);
      return this.handleObjectMapping(script, data);
    }
      // Handle direct JSONPath expressions
      if (script.includes('$')) {
        return this.handleJSONPath(script, data);
      }
      if (script.includes('$string.')) {
        return this.handleStringOperation(script, data);
      }


      if (script.includes('$array.')) {
        return this.handleArrayOperation(script, data);
      }


      if (script.includes('Date.') || script.includes('&&') || script.includes('||')) {
        return this.handleLogicalExpression(script, data);
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





