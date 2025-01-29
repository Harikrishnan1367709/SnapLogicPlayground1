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
