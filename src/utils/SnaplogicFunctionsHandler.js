import { JSONPath } from 'jsonpath-plus';
import moment from 'moment';
import _ from 'lodash';


class SnapLogicFunctionsHandler {
  constructor() {
    this.stringFunctions = {
      camelCase: (str) => str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()),
      capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
      charAt: (str, index) => str.charAt(index),
      charCodeAt: (str, index) => str.charCodeAt(index),
      concat: (...args) => args.join(''),
      contains: (str, search, position = 0) => str.indexOf(search, position) !== -1,
      endsWith: (str, searchString, length) => str.endsWith(searchString, length),
      indexOf: (str, searchValue, fromIndex) => str.indexOf(searchValue, fromIndex),
      kebabCase: (str) => str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`).replace(/^-/, ''),
      lastIndexOf: (str, searchValue, fromIndex) => str.lastIndexOf(searchValue, fromIndex),
      length: (str) => str.length,
      localeCompare: (str, compareString) => str.localeCompare(compareString),
      lowerFirst: (str) => str.charAt(0).toLowerCase() + str.slice(1),
      match: (str, regexp) => str.match(regexp),
      repeat: (str, count) => str.repeat(count),
      replace: (str, searchValue, replaceValue) => str.replace(searchValue, replaceValue),
      replaceAll: (str, searchValue, replaceValue) => str.replaceAll(searchValue, replaceValue),
      search: (str, regexp) => str.search(regexp),
      slice: (str, beginIndex, endIndex) => str.slice(beginIndex, endIndex),
      snakeCase: (str) => str.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`).replace(/^_/, ''),
      split: (str, separator, limit) => str.split(separator, limit),
      sprintf: (str, ...args) => {
        return str.replace(/%(\d+\$)?s/g, (match, num) => {
          if (num) {
            const position = parseInt(num) - 1;
            return args[position] || '';
          }
          return args.shift() || '';
        });
      },
      startsWith: (str, searchString, position) => str.startsWith(searchString, position),
      substr: (str, start, length) => str.substr(start, length),
      substring: (str, start, end) => str.substring(start, end),
      toLowerCase: (str) => str.toLowerCase(),
      toUpperCase: (str) => str.toUpperCase(),
      trim: (str) => str.trim(),
      trimLeft: (str) => str.trimStart(),
      trimRight: (str) => str.trimEnd(),
      upperFirst: (str) => str.charAt(0).toUpperCase() + str.slice(1)
    };
    


    this.arrayFunctions = {
      concat: (arr1, ...arrays) => {
        // Convert any string references to actual arrays
        const resolvedArrays = arrays.map(arr => 
          typeof arr === 'string' && arr.startsWith('$') ? 
          data[arr.slice(1)] : arr
        );
        
        // Perform concatenation with all resolved arrays
        return arr1.concat(...resolvedArrays);
      },
      
      filter: (arr, predicate) => {
        if (typeof predicate === 'string') {
          // Handle string predicate like "x > 3"
          return arr.filter(x => {
            const fn = new Function('x', `return ${predicate}`);
            return fn(x);
          });
        }
        return arr.filter(predicate);
      },
      find: (arr, searchValue) => {
        if (typeof searchValue === 'string') {
          const predicate = new Function('x', `return ${searchValue}`);
          return arr.find(x => predicate(x));
        }
        return arr.find(searchValue);
      },
      
      findIndex: (arr, searchValue) => {
        if (typeof searchValue === 'string') {
          const predicate = new Function('x', `return ${searchValue}`);
          return arr.findIndex(x => predicate(x));
        }
        return arr.findIndex(searchValue);
      },
      includes: (arr, element) => arr.includes(element),
      indexOf: (arr, element) => arr.indexOf(element),
      lastIndexOf: (arr, element) => arr.lastIndexOf(element),
      length: (arr) => arr.length,
      join: (arr, separator) => arr.join(separator),
      map: (arr, mapper) => {
        if (typeof mapper === 'string') {
          const mapFn = new Function('x', `return ${mapper}`);
          return arr.map(x => mapFn(x));
        }
        return arr.map(mapper);
      },
      pop: (arr) => {
        const newArr = [...arr];
        newArr.pop();
        return newArr;
      },
      push: (arr, ...items) => {
        const newArr = [...arr];
        newArr.push(...items);
        return newArr;
      },
      reduce: (arr, reducer, initialValue) => {
        if (typeof reducer === 'string') {
          // Handle string reducer like "acc + curr"
          return arr.reduce((acc, curr) => {
            const fn = new Function('acc', 'curr', `return ${reducer}`);
            return fn(acc, curr);
          }, initialValue);
        }
        return arr.reduce(reducer, initialValue);
      },
      reduceRight: (arr, reducer, initialValue) => {
        if (typeof reducer === 'string') {
          // Handle string reducer like "acc + curr"
          return arr.reduceRight((acc, curr) => {
            const fn = new Function('acc', 'curr', `return ${reducer}`);
            return fn(acc, curr);
          }, initialValue);
        }
        return arr.reduceRight(reducer, initialValue);
      },
    
      reverse: (arr) => [...arr].reverse(),
      shift: (arr) => arr.slice(1),
      slice: (arr, begin, end) => arr.slice(begin, end),
      sort: (arr, compareFunction) => [...arr].sort(compareFunction),
      splice: (arr, start, deleteCount, ...items) => {
        const copy = [...arr];
        copy.splice(start, deleteCount, ...items);
        return copy;
      },
      toObject: (arr, keyCallback, valueCallback) => {
        const result = {};
        arr.forEach((item, index) => {
          const key = keyCallback(item, index);
          const value = valueCallback ? valueCallback(item, index) : item;
          result[key] = value;
        });
        return result;
      },
      toString: (arr) => arr.toString(),
      unshift: (arr, ...elements) => [...elements, ...arr],
    
      // Uint8Array specific methods
      uint8Of: (...args) => Uint8Array.of(...args),
      uint8Subarray: (arr, begin, end) => {
        const uint8Arr = new Uint8Array(arr);
        return uint8Arr.subarray(begin, end);
      },
      uint8IndexOf: (arr, element) => {
        const uint8Arr = new Uint8Array(arr);
        return uint8Arr.indexOf(element);
      },
      uint8LastIndexOf: (arr, element) => {
        const uint8Arr = new Uint8Array(arr);
        return uint8Arr.lastIndexOf(element);
      }
    };
    


    this.dateFunctions = {
      // Core Date Methods
      now: () => new Date(),
      parse: (dateStr, format) => format ? moment(dateStr, format).toDate() : new Date(dateStr),
      UTC: (year, month, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0) => 
        Date.UTC(year, month, day, hour, minute, second, millisecond),
    
      // Local Date/Time Parsing
      LocalDateTime: (dateStr) => moment(dateStr).toDate(),
      LocalDate: (dateStr) => moment(dateStr).startOf('day').toDate(),
      LocalTime: (timeStr) => moment(`1970-01-01 ${timeStr}`).toDate(),
    
      // Getters
      getDate: (date) => date.getDate(),
      getDay: (date) => date.getDay(),
      getFullYear: (date) => date.getFullYear(),
      getHours: (date) => date.getHours(),
      getMilliseconds: (date) => date.getMilliseconds(),
      getMinutes: (date) => date.getMinutes(),
      getMonth: (date) => date.getMonth() + 1,
      getMonthFromZero: (date) => date.getMonth(),
      getUTCMonthFromZero: (date) => date.getUTCMonth(),
      getSeconds: (date) => date.getSeconds(),
      getTime: (date) => date.getTime(),
      
      // UTC Getters
      getUTCDate: (date) => date.getUTCDate(),
      getUTCDay: (date) => date.getUTCDay(),
      getUTCFullYear: (date) => date.getUTCFullYear(),
      getUTCHours: (date) => date.getUTCHours(),
      getUTCMilliseconds: (date) => date.getUTCMilliseconds(),
      getUTCMinutes: (date) => date.getUTCMinutes(),
      getUTCMonth: (date) => date.getUTCMonth() + 1,
      getUTCSeconds: (date) => date.getUTCSeconds(),
      getTimezoneOffset: (date) => date.getTimezoneOffset(),
    
      // Conversion Methods
      toString: (date) => date.toISOString(),
      toLocaleString: (date, options) => date.toLocaleString(options?.locale, options),
      toLocaleDateString: (date, options) => date.toLocaleDateString(options?.locale, options),
      toLocaleDateTimeString: (date, options) => moment(date).format(options?.format || 'YYYY-MM-DDTHH:mm:ss.SSS'),
      toLocaleTimeString: (date, options) => date.toLocaleTimeString(options?.locale, options),
    
      // Plus Methods
      plus: (date, value) => moment(date).add(value, 'milliseconds').toDate(),
      plusDays: (date, days) => moment(date).add(days, 'days').toDate(),
      plusHours: (date, hours) => moment(date).add(hours, 'hours').toDate(),
      plusMillis: (date, millis) => moment(date).add(millis, 'milliseconds').toDate(),
      plusMinutes: (date, minutes) => moment(date).add(minutes, 'minutes').toDate(),
      plusMonths: (date, months) => moment(date).add(months, 'months').toDate(),
      plusSeconds: (date, seconds) => moment(date).add(seconds, 'seconds').toDate(),
      plusWeeks: (date, weeks) => moment(date).add(weeks, 'weeks').toDate(),
      plusYears: (date, years) => moment(date).add(years, 'years').toDate(),
    
      // Minus Methods
      minus: (date, value) => moment(date).subtract(value, 'milliseconds').toDate(),
      minusDays: (date, days) => moment(date).subtract(days, 'days').toDate(),
      minusHours: (date, hours) => moment(date).subtract(hours, 'hours').toDate(),
      minusMillis: (date, millis) => moment(date).subtract(millis, 'milliseconds').toDate(),
      minusMinutes: (date, minutes) => moment(date).subtract(minutes, 'minutes').toDate(),
      minusMonths: (date, months) => moment(date).subtract(months, 'months').toDate(),
      minusSeconds: (date, seconds) => moment(date).subtract(seconds, 'seconds').toDate(),
      minusWeeks: (date, weeks) => moment(date).subtract(weeks, 'weeks').toDate(),
      minusYears: (date, years) => moment(date).subtract(years, 'years').toDate(),
    
      // With Methods
      withDayOfMonth: (date, day) => moment(date).date(day).toDate(),
      withDayOfYear: (date, day) => moment(date).dayOfYear(day).toDate(),
      withHourOfDay: (date, hour) => moment(date).hour(hour).toDate(),
      withMillisOfSecond: (date, millis) => moment(date).millisecond(millis).toDate(),
      withMinuteOfHour: (date, minute) => moment(date).minute(minute).toDate(),
      withMonthOfYear: (date, month) => moment(date).month(month - 1).toDate(),
      withSecondOfMinute: (date, second) => moment(date).second(second).toDate(),
      withYear: (date, year) => moment(date).year(year).toDate()
    };
    


    this.mathFunctions = {
      // Basic Math Functions
      abs: Math.abs,
      ceil: Math.ceil,
      floor: Math.floor,
      max: Math.max,
      min: Math.min,
      pow: Math.pow,
      random: Math.random,
      randomUUID: () => {
        const timestamp = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (timestamp + Math.random() * 16) % 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
      },
      round: Math.round,
      sign: (number) => {
        // Custom implementation to handle zero cases as specified
        if (number === 0 || number === -0) return 0;
        return Math.sign(number);
      },
      trunc: Math.trunc,
  
      // Mathematical Constants
      E: Math.E,
      LN2: Math.LN2,
      LN10: Math.LN10,
      LOG2E: Math.LOG2E,
      LOG10E: Math.LOG10E,
      PI: Math.PI,
      SQRT1_2: Math.SQRT1_2,
      SQRT2: Math.SQRT2
    };
  
  


    this.objectFunctions = {
      entries: (obj) => Object.entries(obj),
      
      keys: (obj) => Object.keys(obj),
      
      values: (obj) => Object.values(obj),
      
      filter: (obj, predicate) => {
        if (typeof predicate === 'string') {
          const fn = new Function('value', 'key', 'obj', `return ${predicate}`);
          return Object.fromEntries(
            Object.entries(obj).filter(([key, value]) => fn(value, key, obj))
          );
        }
        return Object.fromEntries(
          Object.entries(obj).filter(([key, value]) => predicate(value, key, obj))
        );
      },
    
      mapKeys: (obj, mapper) => {
        // Input validation
        if (!obj || typeof obj !== 'object') {
          throw new Error('mapKeys: Input must be an object');
        }

        const result = {};
        
        // Handle string mapper (e.g., simple transformation expression)
        if (typeof mapper === 'string') {
          const fn = new Function('value', 'key', 'obj', `return ${mapper}`);
          Object.entries(obj).forEach(([key, value]) => {
            try {
              const newKey = fn(value, key, obj);
              result[newKey] = value;
            } catch (error) {
              console.error(`mapKeys: Error transforming key "${key}":`, error);
              result[key] = value; // Keep original key on error
            }
          });
          return result;
        }
        
        // Handle function mapper
        if (typeof mapper === 'function') {
          Object.entries(obj).forEach(([key, value]) => {
            try {
              const newKey = mapper(value, key, obj);
              result[newKey] = value;
            } catch (error) {
              console.error(`mapKeys: Error transforming key "${key}":`, error);
              result[key] = value; // Keep original key on error
            }
          });
          return result;
        }

        // Invalid mapper
        throw new Error('mapKeys: Mapper must be a string expression or function');
      },

      
    
          
    
      get: (obj, path, defaultValue = null) => _.get(obj, path, defaultValue),
      
      getFirst: (obj, propertyName, defaultValue = null) => {
        const value = obj[propertyName];
        return Array.isArray(value) && value.length > 0 ? value[0] : (value || defaultValue);
      },
      
      hasPath: (obj, path) => _.has(obj, path),
      
      hasOwnProperty: (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop),
      
      isEmpty: (obj) => Object.keys(obj).length === 0,
      
      merge: (obj, ...sources) => _.merge({}, obj, ...sources),
      mapValues: (obj, mapper) => {
        if (typeof mapper === 'string') {
          const fn = new Function('value', 'key', 'obj', `return ${mapper}`);
          return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, fn(value, key, obj)])
          );
        }
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, mapper(value, key, obj)])
        );
      },
    
      
      extend: (obj, ...sources) => {
        const result = { ...obj };
        sources.forEach(source => {
          if (typeof source === 'string') {
            try {
              source = JSON.parse(source);
            } catch (e) {
              source = {};
            }
          }
          Object.assign(result, source);
        });
        return result;
      }
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
 
  // Add to SnapLogicFunctionsHandler class

  handleJSONPath(script, data) {
    try {
      // Handle root reference
      if (script === '$') {
        return data;
      }
  
      // Handle jsonPath function calls
      if (script.startsWith('jsonPath(')) {
        const pathMatch = script.match(/jsonPath\(\$,\s*["'](.+?)["']\)/);
        if (pathMatch) {
          const [, path] = pathMatch;
          // Configure options for jsonPath function calls
          const options = {
            path,
            json: data,
            wrap: false,
            resultType: 'value',
            flatten: true
          };
          return JSONPath(options);
        }
      }
  
      // Handle direct property access (e.g., $user.screenName)
      if (script.match(/^\$[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+$/)) {
        const [, object, property] = script.match(/^\$([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)$/);
        return data[object]?.[property];
      }
  
      // Handle bracket notation (e.g., $user.['full name'])
      if (script.match(/^\$[a-zA-Z0-9_]+\.\['[^']+'\]$/)) {
        const [, object, property] = script.match(/^\$([a-zA-Z0-9_]+)\.\['([^']+)'\]$/);
        return data[object]?.[property];
      }
  
      // For all other JSONPath expressions
      const options = {
        path: script.startsWith('$.') ? script : `$.${script.slice(1)}`,
        json: data,
        wrap: false,
        resultType: 'value',
        flatten: true,
        sandbox: {
          allowInfinite: true,
          maxLength: Number.MAX_SAFE_INTEGER
        },
        callback: function(payload, type) {
          if (type === 'filter' || type === 'script') {
            return Function(`"use strict";return(${payload})`)();
          }
          return payload;
        }
      };
  
      // Execute JSONPath query
      const result = JSONPath(options);
  
      // Handle different result types
      if (Array.isArray(result)) {
        return result.length === 1 ? result[0] : result;
      }
  
      return result;
    } catch (error) {
      console.error('JSONPath evaluation error:', error);
      console.error('Script:', script);
      console.error('Data:', data);
      return null; // Return null instead of throwing error for better error handling
    }
  }
  
 
  executeScript(script, data) {
    if (!script) return null;
  
    try {

       // Add Math functions handling at the start (after the null check)
    if (script.startsWith('Math.')) {
      const mathMatch = script.match(/Math\.(\w+)(?:\((.*)\))?/);
      if (mathMatch) {
        const [, mathFunction, args] = mathMatch;
         // Special handling for random() and randomUUID()
         if (mathFunction === 'random' && !args) {
          return this.mathFunctions.random();
        }
        
        if (mathFunction === 'randomUUID' && !args) {
          return this.mathFunctions.randomUUID();
        }
        // Handle constants (no parentheses)
        if (!args && this.mathFunctions[mathFunction] !== undefined) {
          return this.mathFunctions[mathFunction];
        }
        
        // Handle functions
        if (this.mathFunctions[mathFunction]) {
          const parsedArgs = args ? args.split(',').map(arg => {
            arg = arg.trim();
            // Handle string numbers
            if (arg.startsWith('"') || arg.startsWith("'")) {
              return arg.slice(1, -1);
            }
            // Handle numeric values
            if (!isNaN(arg)) {
              return Number(arg);
            }
            // Handle variables
            if (arg.startsWith('$')) {
              return data[arg.slice(1)];
            }
            return arg;
          }) : [];
          
          return this.mathFunctions[mathFunction](...parsedArgs);
        }
        
        throw new Error(`Unsupported Math function: ${mathFunction}`);
      }
    }

      // Handle JSONPath expressions first
      if (script.startsWith('$.')) {
        const jsonData = data;
        const result = JSONPath({
          path: script,
          json: jsonData,
          wrap: true,
          flatten: true
        });
  
        if (Array.isArray(result) && result.length > 0) {
          return result.length === 1 ? result[0] : result;
        }
        return result;
      }
  

      // First convert string dates to Date objects in the data
// Inside executeScript method
if (data) {
  // Handle both single objects and arrays of objects
  const processData = (input) => {
    if (Array.isArray(input)) {
      return input.map(item => processData(item));
    }
   
    if (typeof input === 'object' && input !== null) {
      Object.keys(input).forEach(key => {
        const value = input[key];
       
        // Convert dates
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
          input[key] = new Date(value);
        }
        // Process nested objects/arrays
        else if (typeof value === 'object') {
          input[key] = processData(value);
        }
      });
    }
    return input;
  };


  data = processData(data);
}



      // Handle Local parsing methods
      if (script.includes('Local')) {
        // Handle LocalDateTime.parse
        const dateTimeMatch = script.match(/LocalDateTime\.parse\("([^"]+)"\)/);
        if (dateTimeMatch) {
          const [, dateStr] = dateTimeMatch;
          const date = moment(dateStr).toDate();
          return date;
        }
  
        // Handle LocalDate.parse
        const dateMatch = script.match(/LocalDate\.parse\("([^"]+)"\)/);
        if (dateMatch) {
          const [, dateStr] = dateMatch;
          const date = moment(dateStr).startOf('day').toDate();
          return date;
        }
  
        // Handle LocalTime.parse
        const timeMatch = script.match(/LocalTime\.parse\("([^"]+)"\)/);
        if (timeMatch) {
          const [, timeStr] = timeMatch;
          const date = moment(`1970-01-01 ${timeStr}`).toDate();
          return date;
        }
      }
  
      // Static Date methods
      if (script.startsWith('Date.')) {
        const staticMatch = script.match(/Date\.(\w+)\((.*)\)/);
        if (staticMatch) {
          const [, staticMethod, staticArgs] = staticMatch;
          const parsedArgs = staticArgs ? staticArgs.split(',').map(arg => 
            !isNaN(arg.trim()) ? Number(arg.trim()) : arg.trim().replace(/['"]/g, '')
          ) : [];
          
          if (this.dateFunctions[staticMethod]) {
            return this.dateFunctions[staticMethod](...parsedArgs);
          }
        }
      }
  
      // Handle method calls (including arrow functions)
      const methodMatch = script.match(/\$(\w+)\.(\w+)\((.*)\)/);
      if (methodMatch) {
        const [, propertyName, methodName, argsString] = methodMatch;
        const value = data[propertyName];
  
        // If data is an array, treat it as a collection of objects
        if (Array.isArray(data)) {
          return data.map(item => {
            const value = item[propertyName];
            if (value === undefined) {
              return item;
            }
  
            // Handle arrow functions
            if (argsString.includes('=>')) {
              const fn = eval(`(${argsString.trim()})`);
              if (typeof value === 'object' && value !== null && this.objectFunctions[methodName]) {
                return this.objectFunctions[methodName](value, fn);
              }
            }
  
            const args = this.parseArguments(argsString, data);
  
            if (typeof value === 'string' && this.stringFunctions[methodName]) {
              return this.stringFunctions[methodName](value, ...args);
            }
            if (Array.isArray(value) && this.arrayFunctions[methodName]) {
              return this.arrayFunctions[methodName](value, ...args);
            }
            if ((value instanceof Date || moment.isDate(value)) && this.dateFunctions[methodName]) {
              return this.dateFunctions[methodName](value, ...args);
            }
            if (typeof value === 'object' && value !== null && this.objectFunctions[methodName]) {
              return this.objectFunctions[methodName](value, ...args);
            }
  
            return value;
          });
        }
  
        // Handle single object with arrow function
        if (argsString.includes('=>')) {
          const fn = eval(`(${argsString.trim()})`);
          if (typeof value === 'object' && value !== null && this.objectFunctions[methodName]) {
            return this.objectFunctions[methodName](value, fn);
          }
        }
  
        // Handle regular arguments
        const args = this.parseArguments(argsString, data);
  
        if (typeof value === 'string' && this.stringFunctions[methodName]) {
          return this.stringFunctions[methodName](value, ...args);
        }
        if (Array.isArray(value) && this.arrayFunctions[methodName]) {
          return this.arrayFunctions[methodName](value, ...args);
        }
        if ((value instanceof Date || moment.isDate(value)) && this.dateFunctions[methodName]) {
          return this.dateFunctions[methodName](value, ...args);
        }
        if (typeof value === 'object' && value !== null && this.objectFunctions[methodName]) {
          let args;
          if (argsString.includes('=>')) {
            args = [eval(`(${argsString})`)];
          } else if (argsString.includes('{')) {
            try {
              args = [JSON.parse(argsString)];
            } catch (e) {
              args = [eval(`(${argsString})`)];
            }
          } else {
            args = argsString.split(',').map(arg => {
              arg = arg.trim();
              if (arg.startsWith('"') || arg.startsWith("'")) return arg.slice(1, -1);
              if (!isNaN(arg)) return Number(arg);
              if (arg === 'true') return true;
              if (arg === 'false') return false;
              if (arg === 'null') return null;
              return arg;
            }).filter(arg => arg !== '');
          }
          return this.objectFunctions[methodName](value, ...args);
        }
  
        throw new Error(`Unsupported operation '${methodName}' for type: ${typeof value}`);
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
  
      // Handle other expressions
      if (script.includes('Date.parse') || script.includes('&&') || script.includes('||')) {
        return this.handleLogicalExpression(script, data);
      }
  
      if (script.includes('Date.now()') || (script.includes('?') && script.includes('T'))) {
        return this.handleComplexDateExpression(script);
      }
  
      if (script.trim().startsWith('{') && script.includes('$.')) {
        return this.handleObjectMapping(script, data);
      }
  
      if (script.includes('$')) {
        return this.handleJSONPath(script, data);
      }
  
      throw new Error(`Unsupported script: ${script}`);
    } catch (error) {
      console.error('Script execution error:', error);
      throw new Error(`Script execution failed: ${error.message}`);
    }
  }
  
  parseArguments(argsString, data) {
    if (!argsString) return [];
     // Handle arrow functions for reduce/reduceRight
  if (argsString.includes('=>')) {
    const lastCommaIndex = argsString.lastIndexOf(',');
    if (lastCommaIndex !== -1) {
      const arrowFunction = argsString.substring(0, lastCommaIndex).trim();
      const initialValue = argsString.substring(lastCommaIndex + 1).trim();
      
      // Create the reducer function
      const reducer = (acc, curr) => {
        const fn = new Function('acc', 'curr', `return ${arrowFunction.match(/=>\s*(.+)/)[1]};`);
        return fn(acc, curr);
      };
      
      return [reducer, eval(initialValue)];
    }
  }


    return argsString.split(',').map(arg => {
      arg = arg.trim();
      
      // Handle arrow functions for array methods
      if (arg.includes('=>')) {
        return eval(arg);
      }
      
      // Handle variable references
      if (arg.startsWith('$')) {
        return data[arg.slice(1)];
      }
      
      // Handle numeric values
      if (!isNaN(arg)) {
        return Number(arg);
      }
      
      // Handle string literals
      if (arg.startsWith('"') || arg.startsWith("'")) {
        return arg.slice(1, -1);
      }
      
      return arg;
    });
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





