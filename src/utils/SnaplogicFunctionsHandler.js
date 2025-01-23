import { JSONPath } from 'jsonpath-plus';
import moment from 'moment';
import _ from 'lodash';

class SnapLogicFunctionsHandler {
  evaluateJsonPath(path, data) {
    return JSONPath({ path, json: data });
  }

  evaluateMatch(expression, data) {
    const matchPattern = expression.match(/match\s*{([^}]*)}/)[1];
    const cases = matchPattern.split('\n')
      .map(line => line.trim())
      .filter(line => line);

    for (const caseStr of cases) {
      const [pattern, result] = caseStr.split('=>').map(s => s.trim());
      if (pattern === '_') {
        return this.evaluateExpression(result, data);
      }
      
      try {
        const matches = this.evaluateJsonPath(pattern, data);
        if (matches && matches.length > 0) {
          return this.evaluateExpression(result, { ...data, $match: matches });
        }
      } catch (error) {
        console.error("Match pattern evaluation error:", error);
      }
    }
    return null;
  }

  evaluatePipeline(expression, data) {
    return expression.split('|')
      .map(exp => exp.trim())
      .reduce((acc, exp) => {
        if (exp.startsWith('$')) {
          return this.evaluateJsonPath(exp, acc);
        }
        return this.evaluateFunction(exp, acc);
      }, data);
  }

  evaluateFunction(funcExpression, data) {
    const [funcName, ...args] = funcExpression
      .match(/(\w+)\((.*)\)/)?.[0]
      .slice(0, -1)
      .split('(');

    const evaluatedArgs = args.map(arg => 
      arg.startsWith('$') 
        ? this.evaluateJsonPath(arg, data)
        : arg
    );

    switch (funcName) {
      // Array Functions
      case 'map':
        return Array.isArray(data) ? data.map(item => this.evaluateExpression(args[0], item)) : data;
      case 'filter':
        return Array.isArray(data) ? data.filter(item => this.evaluateExpression(args[0], item)) : data;
      case 'sort':
        return Array.isArray(data) ? [...data].sort() : data;
      case 'reverse':
        return Array.isArray(data) ? [...data].reverse() : data;

      // String Functions
      case 'toLowerCase':
        return String(data).toLowerCase();
      case 'toUpperCase':
        return String(data).toUpperCase();
      case 'trim':
        return String(data).trim();
      case 'replace':
        return String(data).replace(evaluatedArgs[0], evaluatedArgs[1]);

      // Date Functions
      case 'now':
        return moment().format();
      case 'plusDays':
        return moment(data).add(evaluatedArgs[0], 'days').format();
      case 'minusDays':
        return moment(data).subtract(evaluatedArgs[0], 'days').format();

      // Math Functions
      case 'abs':
        return Math.abs(Number(data));
      case 'round':
        return Math.round(Number(data));
      case 'ceil':
        return Math.ceil(Number(data));
      case 'floor':
        return Math.floor(Number(data));

      // Object Functions
      case 'keys':
        return Object.keys(data);
      case 'values':
        return Object.values(data);
      case 'merge':
        return _.merge({}, data, evaluatedArgs[0]);

      default:
        throw new Error(`Unknown function: ${funcName}`);
    }
  }

  evaluateExpression(expression, context) {
    // Handle basic expressions
    if (expression.startsWith('$')) {
      return this.evaluateJsonPath(expression, context);
    }

    // Handle literal values
    if (['true', 'false', 'null', 'undefined'].includes(expression)) {
      return JSON.parse(expression);
    }

    // Handle numbers
    if (!isNaN(expression)) {
      return Number(expression);
    }

    // Handle strings
    if (expression.startsWith('"') || expression.startsWith("'")) {
      return expression.slice(1, -1);
    }

    // Handle function calls
    if (expression.includes('(')) {
      return this.evaluateFunction(expression, context);
    }

    // Handle object references
    return _.get(context, expression);
  }
}

export default SnapLogicFunctionsHandler;