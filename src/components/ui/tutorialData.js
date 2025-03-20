export  const tutorialData = [
    {
      id: 'what-is-SnapMapper',
          title: '1 - What is SnapMapper',
          content: `SnapMapper is an interactive environment designed for developers and integration specialists to experiment with SnapLogic's expression language and data transformation capabilities.
  
  Key Features:
  • Interactive Expression Testing
    - Real-time validation
    - Immediate feedback
    - Syntax highlighting
  
  • Multiple Input Support
    - JSON data
  
  • Advanced Debugging
    - Step-by-step execution
    - Error tracking
  
  • Learning Environment
    - Built-in examples
    - Documentation access
    - Best practices guides`,
      subTopics: [
    
        {
          id: 'why SnapMapper',
          title: '1.1 - Why SnapMapper',
          content: `SnapMapper offers several key advantages for developers and integration specialists:
  
  1. Rapid Prototyping
     • Test expressions instantly
     • Validate transformations
     • Experiment with different approaches
     • Quick iteration cycles
  
  2. Learning and Development
     • Safe environment for learning
     • Interactive documentation
     • Real-world examples
     • Best practices implementation
  
  3. Collaboration
     • Share expressions with team
     • Standardize approaches
     • Knowledge transfer
     • Code review support
  
  4. Productivity
     • Faster development
     • Reduced errors
     • Immediate feedback
     • Enhanced debugging`,
  
  
        },
        {
          id: 'ui-overview',
          title: '1.2 - User Interface Overview',
          content: `The SnapMapper interface is organized into several key areas:
      
      1. Navigation Bar
         • Project management
         • Documentation links
         • User preferences
      
      2. Input Panel
         • Data entry
         • File upload
         • Format selection
         • Template library
      
      3. Expression Editor
         • Code editing
         • Syntax highlighting
         • Error detection
      
      4. Output Panel
         • Results display
         • Error messages
         • Debug information
      
      5. Documentation Panel
         • Function reference
         • Examples
         • Tutorials
         • Best practices`,
      
      
        },
        {
          id: 'core-functionalities',
          title: '1.3 - Core Functionalities',
          content: `SnapMapper provides essential core functionalities for integration development:
      
      1. Data Transformation
         • JSON path queries
         • Data mapping
         • Structure modification
      
      2. Expression Processing
         • Syntax validation
         • Runtime execution
         • Error handling
         • Performance optimization
      
      3. Testing and Debugging
         • Real-time validation
         • Error detection
         • Step-through debugging
      
      4. Project Management
         • Save expressions
         • Share code
         • Import/Export`,
      
        },
      ]
    },
   
    {
      id: 'functions',
      title: '2 - Functions',
      content: 'SnapLogic provides a comprehensive set of built-in functions for data manipulation and transformation.',
      subTopics: [
        {
          id: 'string-functions',
          title: '2.1 - String Functions',
          content: `String functions in SnapLogic provide powerful capabilities for manipulating and transforming text data. These functions help you modify, search, and extract information from strings.

Available String Functions:
• toUpperCase()
• toLowerCase()
• length()
• trim()
• camelCase()
• kebabCase()()
• upperFirst()
• lowerFirst()
• charAt()
• charCodeAt()


`,
          subTopics: [
            {
              id: 'toUpperCase',
              title: '2.1.1 - toUpperCase()',
              content: `Converts all characters in a string to uppercase. Useful for standardizing text like "Mulecraft" to "MULECRAFT".`,
              codeExample: {
                input: `
{
  "text": "mulecraft"
}`,
                script: `$text.toUpperCase()`,
                output: `"MULECRAFT"`
              },
              exercise: {
                description: `Convert the input string to uppercase to get "SNAPLOGIC".`,
                expectedOutput: `"SNAPLOGIC"`,
                input: `
{
"text": "snaplogic"
}`
              }
            },
            {
              id: 'toLowerCase',
              title: '2.1.2 - toLowerCase()',
              content: `Converts all characters in a string to lowercase. Transforms "MULECRAFT" to "mulecraft" for consistent formatting.`,
              codeExample: {
                input: `
{
  "text": "MULECRAFT"
}`,
                script: `$text.toLowerCase()`,
                output: `"mulecraft"`
              },
              exercise: {
                description: `Convert the input string to lowercase to get "snaplogic".`,
                expectedOutput: `"snaplogic"`,
                input: `
{
"text": "SNAPLOGIC"
}`
              }
            },
            {
              id: 'length',
              title: '2.1.3 - length()',
              content: `Returns the length of the string. For example, "Mulecraft" has 9 characters.`,
              codeExample: {
                input: `
{
  "text": "Mulecraft"
}`,
                script: `$text.length()`,
                output: `9`
              },
              exercise: {
                description: `Get the length of the "Mulecraft" string.`,
                expectedOutput: `9`,
                input: `
{
  "text": "snaplogic"
}`
              }
            },
            {
              id: 'trim',
              title: '2.1.4 - trim()',
              content: `Removes whitespace from both ends of a string. Cleans up "  Mulecraft  " to "Mulecraft".`,
              codeExample: {
                input: `
{
  "text": "  Mulecraft  "
}`,
                script: `$text.trim()`,
                output: `"Mulecraft"`
              },
              exercise: {
                description: `Trim spaces from around " Snaplogic" to get "Snaplogic".`,
                expectedOutput: `"Snaplogic"`,
                input: `
{
  "text": "  Snaplogic  "
}`
              }
            },
            {
              id: 'camelCase',
              title: '2.1.5 - camelCase()',
              content: `Converts string to camelCase format. Transforms "mule craft" or "Mule Craft" to "muleCraft".`,
              codeExample: {
                input: `
{
  "text": "mule craft"
}`,
                script: `$text.camelCase()`,
                output: `"muleCraft"`
              },
              exercise: {
                description: `Convert the phrase "Mule Craft" to camelCase.`,
                expectedOutput: `"muleCraft"`,
                input: `
{
  "text": "Mule Craft"
}`
              }
            },
            {
              id: 'kebabCase',
              title: '2.1.6 - kebabCase()',
              content: `Converts string to kebab-case format. Changes "MuleCraft" to "mule-craft".`,
              codeExample: {
                input: `
{
  "text": "MuleCraft"
}`,
                script: `$text.kebabCase()`,
                output: `"mule-craft"`
              },
              exercise: {
                description: `Convert "SnapLogic" to kebab-case.`,
                expectedOutput: `"snap-logic"`,
                input: `
{
  "text": "SnapLogic"
}`
              }
            },
            {
              id: 'upperFirst',
              title: '2.1.7 - upperFirst()',
              content: `Converts the first character of a string to uppercase. Turns "mulecraft" into "Mulecraft".`,
              codeExample: {
                input: `
{
  "text": "mulecraft"
}`,
                script: `$text.upperFirst()`,
                output: `"Mulecraft"`
              },
              exercise: {
                description: `Capitalize only the first letter of "snaplogic" to get "Snaplogic".`,
                expectedOutput: `"Snaplogic"`,
                input: `
{
  "text": "snaplogic"
}`
              }
            },
            {
              id: 'lowerFirst',
              title: '2.1.8 - lowerFirst()',
              content: `Converts the first character of a string to lowercase. Changes "Mulecraft" to "mulecraft".`,
              codeExample: {
                input: `
{
  "text": "Mulecraft"
}`,
                script: `$text.lowerFirst()`,
                output: `"mulecraft"`
              },
              exercise: {
                description: `Convert only the first character of "Snaplogic" to lowercase to get "snaplogic".`,
                expectedOutput: `"snaplogic"`,
                input: `
{
  "text": "Snaplogic"
}`
              }
            },
            {
              id: 'charAt',
              title: '2.1.9 - charAt()',
              content: `Returns the character at the specified index. For "Mulecraft", index 4 returns "c".`,
              codeExample: {
                input: `
{
  "text": "Mulecraft"
}`,
                script: `$text.charAt(4)`,
                output: `"c"`
              },
              exercise: {
                description: `Find the character at index 4 in "Mulecraft" (zero-based index).`,
                expectedOutput: `"l"`,
                input: `
{
  "text": "Snaplogic"
}`
              }
            },
            {
              id: 'charCodeAt',
              title: '2.1.10 - charCodeAt()',
              content: `Returns the Unicode value of the character at the specified index. For "Mulecraft", index 0 ("M") returns 77.`,
              codeExample: {
                input: `
{
  "text": "Mulecraft"
}`,
                script: `$text.charCodeAt(0)`,
                output: `77`
              },
              exercise: {
                description: `Get the Unicode value of the first character in "Snaplogic".`,
                expectedOutput: `115`,
                input: `
{
  "text": "Snaplogic"
}`
              }
            }
          ]
        },
        {
          id: 'array-functions',
          title: '2.2 - Array Functions',
          content: `Array functions in SnapLogic provide powerful capabilities for manipulating and transforming arrays. These functions help you modify, search, and process collections of data.

Available Array Functions:
• length()
• indexOf()
• findIndex()
• find()
• map()
• filter()
• sort()
• concat()
• join()
• slice()`,
          subTopics: [
            {
              "id": "length",
              "title": "2.2.1 - length()",
              "content": "Returns the number of elements in an array.",
              "codeExample": {
                "input": `
{
  "numbers": [1, 2, 3, 4, 5]
}`,
                "script": `$numbers.length()`,
                "output": `5`
              },
              "exercise": {
                "description": "Get the number of elements in the array [10, 20, 30, 40].",
                "expectedOutput": "4",
                "input": `
{
  "numbers": [10, 20, 30, 40]
}`
              }
            },
            {
              "id": "indexOf",
              "title": "2.2.2 - indexOf()",
              "content": "Returns the first index at which a given element can be found in the array.",
              "codeExample": {
                "input": `
{
  "numbers": [1, 2, 3, 4, 5]
}`,
                "script": `$numbers.indexOf(3)`,
                "output": `2`
              },
              "exercise": {
                "description": "Find the index of 50 in the array [10, 20, 50, 40].",
                "expectedOutput": "2",
                "input": `
{
  "numbers": [10, 20, 50, 40]
}`
              }
            },
            {
              "id": "findIndex",
              "title": "2.2.3 - findIndex()",
              "content": "Returns the index of the first element in the array that satisfies the provided testing function.",
              "codeExample": {
                "input": `
{
  "numbers": [1, 2, 3, 4, 5]
}`,
                "script": `$numbers.findIndex((item) => item > 3)`,
                "output": `3`
              },
              "exercise": {
                "description": "Find the index of the first number greater than 25 in the array [10, 20, 30, 40].",
                "expectedOutput": "2",
                "input": `
{
  "numbers": [10, 20, 30, 40]
}`
              }
            },
            {
              "id": "find",
              "title": "2.2.4 - find()",
              "content": "Returns the first element in the array that satisfies the provided testing function.",
              "codeExample": {
                "input": `
{
  "numbers": [1, 2, 3, 4, 5]
}`,
                "script": `$numbers.find((item) => item > 3)`,
                "output": `4`
              },
              "exercise": {
                "description": "Find the first number greater than 25 in the array [10, 20, 30, 40].",
                "expectedOutput": "30",
                "input": `
{
  "numbers": [10, 20, 30, 40]
}`
              }
            },
            {
              "id": "map",
              "title": "2.2.5 - map()",
              "content": "Creates a new array with the results of calling a provided function on every element.",
              "codeExample": {
                "input": `
{
  "numbers": [1, 2, 3, 4, 5],
  "words": ["Hello", "World", "!"]
}`,
                "script": `$numbers.map((item) => item * 2)
$words.map((word) => word.toUpperCase())`,
                "output": `[2, 4, 6, 8, 10]
["HELLO", "WORLD", "!"]`
              },
              "exercise": {
                "description": "Multiply each number in the array [1, 2, 3] by 3.",
                "expectedOutput": "[3, 6, 9]",
                "input": `
{
  "numbers": [1, 2, 3]
}`
              }
            },
            {
              "id": "filter",
              "title": "2.2.6 - filter()",
              "content": "Creates a new array with all elements that pass the test implemented by the provided function.",
              "codeExample": {
                "input": `
{
  "numbers": [1, 2, 3, 4, 5],
  "words": ["Hello", "World", "!"]
}`,
                "script": `$numbers.filter((num) => num > 2)
$words.filter((word) => word.length > 3)`,
                "output": `[3, 4, 5]
["Hello", "World"]`
              },
              "exercise": {
                "description": "Filter the array [10, 15, 20, 25] to keep only numbers greater than 15.",
                "expectedOutput": "[20, 25]",
                "input": `
{
  "numbers": [10, 15, 20, 25]
}`
              }
            },
            {
              "id": "sort",
              "title": "2.2.7 - sort()",
              "content": "Sorts the elements of an array in place and returns the sorted array.",
              "codeExample": {
                "input": `
{
  "numbers": [5, 2, 4, 1, 3],
  "words": ["World", "Hello", "!"]
}`,
                "script": `$numbers.sort()
$words.sort()`,
                "output": `[1, 2, 3, 4, 5]
["!", "Hello", "World"]`
              },
              "exercise": {
                "description": "Sort the array [30, 10, 50, 20] in ascending order.",
                "expectedOutput": "[10, 20, 30, 50]",
                "input": `
{
  "numbers": [30, 10, 50, 20]
}`
              }
            },
            {
              "id": "concat",
              "title": "2.2.8 - concat()",
              "content": "Merges two or more arrays and returns a new array.",
              "codeExample": {
                "input": `
{
  "array1": [1, 2, 3],
  "array2": [4, 5, 6]
}`,
                "script": `$array1.concat($array2)`,
                "output": `[1, 2, 3, 4, 5, 6]`
              },
              "exercise": {
                "description": "Concatenate the arrays [1, 2] and [3, 4].",
                "expectedOutput": "[1, 2, 3, 4]",
                "input": `
{
  "array1": [1, 2],
  "array2": [3, 4]
}`
              }
            },
            {
              "id": "join",
              "title": "2.2.9 - join()",
              "content": "Joins all elements of an array into a string.",
              "codeExample": {
                "input": `
{
  "words": ["Hello", "World", "!"]
}`,
                "script": `$words.join(" ")`,
                "output": `"Hello World !"`
              },
              "exercise": {
                "description": "Join the array [\"I\", \"am\", \"here\"] with a space separator.",
                "expectedOutput": "\"I am here\"",
                "input": `
{
"words": ["I", "am", "here"]
}`
              }
            },
            {
              "id": "slice",
              "title": "2.2.10 - slice()",
              "content": "Returns a shallow copy of a portion of an array.",
              "codeExample": {
                "input": `
{
  "numbers": [1, 2, 3, 4, 5]
}`,
                "script": `$numbers.slice(1, 3)`,
                "output": `[2, 3]`
              },
              "exercise": {
                "description": "Extract elements from index 1 to 3 (exclusive) from the array [10, 20, 30, 40, 50].",
                "expectedOutput": "[20, 30]",
                "input": `
{
  "numbers": [10, 20, 30, 40, 50]
}`
              }
            }
          ]
        },
        {
          id: 'object-functions',
          title: '3.3 - Object Functions',
          content: `Object functions in SnapLogic provide powerful capabilities for manipulating and transforming JavaScript objects. These functions help you access, modify, and process object data efficiently.

Available Object Functions:
• keys()
• values()
• entries()
• filter()
• mapValues()
• isEmpty()
• merge()
• has()`,
          subTopics:[
            {
              "id": "keys",
              "title": "2.3.1 - keys()",
              "content": "Returns an array of a given object's own enumerable property names.",
              "codeExample": {
                "input": `
{
  "user": {
    "name": "John",
     "age": 30,
     "address": {
      "city": "New York",
      "zip": "10001"
          },
      "tags": ["admin", "active"]
      }
}`,
                "script": `$user.keys()`,
                "output": `["name", "age", "address", "tags"]`
              },
              "exercise": {
                "description": "Get the property names of the object with properties 'id', 'title', and 'status'.",
                "expectedOutput": `["id", "title", "status"]`,
                "input": `
{
  "data": {
    "id": 1,
    "title": "Test",
    "status": "active"
      }
}`
              }
            },
            {
              "id": "values",
              "title": "2.3.2 - values()",
              "content": "Returns an array of a given object's own enumerable property values.",
              "codeExample": {
                "input": `
{
  "user": {
    "name": "John",
    "age": 30,
    "address": {
    "city": "New York",
    "zip": "10001"
          },
    "tags": ["admin", "active"]
      }
}`,
                "script": `$user.values()`,
                "output": `
[
  "John",
  30,
  {"city": "New York", "zip": "10001"},
  ["admin", "active"]
]`
              },
              "exercise": {
                "description": "Get the property values of the object with properties 'id', 'title', and 'status'.",
                "expectedOutput": `
[
  1,
  "Test",
  "active"
]`,
                "input": `
{
  "data": {
      "id": 1,
      "title": "Test",
      "status": "active"
      }
}`
              }
            },
            {
              "id": "entries",
              "title": "2.3.3 - entries()",
              "content": "Returns an array of a given object's own enumerable string-keyed property key-value pairs.",
              "codeExample": {
                "input": `
{
  "user": {
   "name": "John",
    "age": 30
    }
}`,
                "script": `$user.entries()`,
                "output": `
[
  ["name", "John"],
  ["age", 30]
]`
              },
              "exercise": {
                "description": "Get the key-value pairs of the object with properties 'color' and 'size'.",
                "expectedOutput": `
[
  ["color", "blue"],
  ["size", 10]
]`,
                "input": `
{
  "item": {
    "color": "blue",
    "size": 10
      }
}`
              }
            },
            {
              "id": "filter",
              "title": "2.3.4 - filter()",
              "content": "Creates a new object with all elements that pass the test implemented by the provided function.",
              "codeExample": {
                "input": `
{
  "products": {
  "item1": { "price": 100, "inStock": true },
  "item2": { "price": 200, "inStock": false },
  "item3": { "price": 300, "inStock": true }
      }
}`,
                "script": `$products.filter((value) => value.price > 150)`,
                "output": `
{
  "item2": { "price": 200, "inStock": false },
  "item3": { "price": 300, "inStock": true }
}`
              },
              "exercise": {
                "description": "Filter the object to keep only items with a price greater than 50.",
                "expectedOutput": `
{
  "item1": { "price": 75, "inStock": true },
  "item2": { "price": 100, "inStock": false }
}`,
                "input": `
{
  "products": {
  "item1": { "price": 75, "inStock": true },
  "item2": { "price": 100, "inStock": false },
  "item3": { "price": 25, "inStock": true }
      }
}`
              }
            },
            {
              "id": "mapValues",
              "title": "2.3.5 - mapValues()",
              "content": "Creates a new object with the results of calling a provided function on every value.",
              "codeExample": {
                "input": `
{
  "products": {
  "item1": { "price": 100, "inStock": true },
  "item2": { "price": 200, "inStock": false }
      }
}`,
                "script": `$products.mapValues((value) => value.price * 2)`,
                "output": `
{
  "item1": { "price": 200, "inStock": true },
  "item2": { "price": 400, "inStock": false }
}`
              },
              "exercise": {
                "description": "Double the price of each item in the object.",
                "expectedOutput": `
{
  "item1": { "price": 50, "inStock": true },
  "item2": { "price": 150, "inStock": false }
}`,
                "input": `
{
  "products": {
    "item1": { "price": 25, "inStock": true },
    "item2": { "price": 75, "inStock": false }
    }
}`
              }
            },
            {
              "id": "isEmpty",
              "title": "2.3.6 - isEmpty()",
              "content": "Checks if an object is empty (has no enumerable string-keyed properties).",
              "codeExample": {
                "input": `
{
  "user": {
   "name": "John",
   "age": 30
      },
    "empty": {}
}`,
                "script": `$user.isEmpty()
$empty.isEmpty()`,
                "output": `false
true`
              },
              "exercise": {
                "description": "Check if the object with no properties is empty.",
                "expectedOutput": "true",
                "input": `
{
  "data": {}
}`
              }
            },
            {
              "id": "merge",
              "title": "2.3.7 - merge()",
              "content": "Merges two or more objects recursively.",
              "codeExample": {
                "input": `
{
  "user": {
     "name": "John",
      "address": {
        "city": "New York"
          }
     }
}`,
                "script": `
$user.merge({
  "role": "admin",
  "address": {
    "country": "USA"
      }
})`,
                "output": `
{
  "name": "John",
  "role": "admin",
  "address": {
  "city": "New York",
  "country": "USA"
    }
}`
              },
              "exercise": {
                "description": "Merge an object with 'name' and 'age' with another object adding 'role'.",
                "expectedOutput": `
{
  "name": "Alice",
  "age": 25,
  "role": "user"
}`,
                "input": `
{
  "user": {
    "name": "Alice",
    "age": 25
      }
}`,
                "script": `
$user.merge({
  "role": "user"
})`
              }
            },
            {
              "id": "has",
              "title": "2.3.8 - has()",
              "content": "Checks if path is a direct property of object.",
              "codeExample": {
                "input": `
{
  "user": {
    "name": "John",
    "address": {
      "city": "New York"
          }
      }
}`,
                "script": `$user.has("address.city")
$user.has("address.country")`,
                "output": `true
false`
              },
              "exercise": {
                "description": "Check if the object has the property 'details.status'.",
                "expectedOutput": "true",
                "input": `
{
  "user": {
    "name": "Bob",
    "details": {
      "status": "active"
          }
        }
}`
              }
            }
          ]
        },
        {
          id: 'number-functions',
          title: '2.4 - Number Functions',
          content: `Number functions in SnapLogic provide precise control over number formatting and mathematical operations. These functions help you format numbers for display and perform accurate calculations.

Available Number Functions:
• toExponential()
• toFixed()
• toPrecision()`,
          subTopics:[
            {
              "id": "toExponential",
              "title": "2.4.1 - toExponential()",
              "content": "Returns a string representing the number in exponential notation.",
              "codeExample": {
                "input": `
{
  "price": 123.456789
}`,
                "script": `$price.toExponential()
$price.toExponential(2)`,
                "output": `"1.23456789e+2"
"1.23e+2"`
              },
              "exercise": {
                "description": "Convert the number 987.654 to exponential notation with 3 decimal places.",
                "expectedOutput": `"9.877e+2"`,
                "input": `
{
  "value": 987.654
}`
              }
            },
            {
              "id": "toFixed",
              "title": "2.4.2 - toFixed()",
              "content": "Returns a string representing the number with a specified number of decimals.",
              "codeExample": {
                "input": `
{
  "percentage": 0.89473,
  "amount": 1234.5678
}`,
                "script": `$percentage.toFixed(2)
$amount.toFixed(2)`,
                "output": `"0.89"
"1234.57"`
              },
              "exercise": {
                "description": "Format the number 45.6789 to 2 decimal places.",
                "expectedOutput": `"45.68"`,
                "input": `
{
  "number": 45.6789
}`
              }
            },
            {
              "id": "toPrecision",
              "title": "2.4.3 - toPrecision()",
              "content": "Returns a string representing the number with a specified length.",
              "codeExample": {
                "input": `
{
  "quantity": 4.2103,
  "amount": 1234.5678
}`,
                "script": `$quantity.toPrecision(2)
$amount.toPrecision(4)`,
                "output": `"4.2"
"1235"`
              },
              "exercise": {
                "description": "Format the number 78.9123 to a precision of 3 digits.",
                "expectedOutput": `"78.9"`,
                "input": `
{
  "value": 78.9123
}`
              }
            }
          ]
        },
        {
          id: 'math-functions',
          title: '2.5 - Math Functions',
          content: `Math functions in SnapLogic provide essential mathematical operations and constants. These functions help you perform calculations and mathematical transformations.

Available Math Functions:
• abs()
• ceil()
• floor()
• round()
• max()
• min()
• pow()
• sqrt()
• random()`,
          subTopics: [
            {
              "id": "abs",
              "title": "2.5.1 - abs()",
              "content": "Returns the absolute value of a number.",
              "codeExample": {
                "input": `
{
  "value": -7.25
}`,
                "script": `$Math.abs($value)`,
                "output": `"7.25"`
              },
              "exercise": {
                "description": "Find the absolute value of -15.9.",
                "expectedOutput": `"15.9"`,
                "input": `
{
  "number": -15.9
}`
              }
            },
            {
              "id": "ceil",
              "title": "2.5.2 - ceil()",
              "content": "Returns the smallest integer greater than or equal to a number.",
              "codeExample": {
                "input": `
{
  "value": 3.7
}`,
                "script": `$Math.ceil($value)`,
                "output": `4`
              },
              "exercise": {
                "description": "Round 12.1 up to the nearest integer.",
                "expectedOutput": `13`,
                "input": `
{
  "number": 12.1
}`
              }
            },
            {
              "id": "floor",
              "title": "2.5.3 - floor()",
              "content": "Returns the largest integer less than or equal to a number.",
              "codeExample": {
                "input": `
{
  "value": 5.9
}`,
                "script": `$Math.floor($value)`,
                "output": `5`
              },
              "exercise": {
                "description": "Round 19.8 down to the nearest integer.",
                "expectedOutput": `19`,
                "input": `
{
  "number": 19.8
}`
              }
            },
            {
              "id": "round",
              "title": "2.5.4 - round()",
              "content": "Rounds a number to the nearest integer.",
              "codeExample": {
                "input": `
{
  "value": 4.5
}`,
                "script": `$Math.round($value)`,
                "output": `5`
              },
              "exercise": {
                "description": "Round 7.3 to the nearest integer.",
                "expectedOutput": `7`,
                "input": `
{
  "number": 7.3
}`
              }
            },
            {
              "id": "max",
              "title": "2.5.5 - max()",
              "content": "Returns the largest of zero or more numbers.",
              "codeExample": {
                "input": `
{
  "numbers": [3, 8, 1, 10, 5]
}`,
                "script": `$Math.max(...$numbers)`,
                "output": `10`
              },
              "exercise": {
                "description": "Find the maximum value in the array [4, 9, 2, 15, 7].",
                "expectedOutput": `15`,
                "input": `
{
  "values": [4, 9, 2, 15, 7]
}`
              }
            },
            {
              "id": "min",
              "title": "2.5.6 - min()",
              "content": "Returns the smallest of zero or more numbers.",
              "codeExample": {
                "input": `
{
  "numbers": [3, 8, 1, 10, 5]
}`,
                "script": `$Math.min(...$numbers)`,
                "output": `1`
              },
              "exercise": {
                "description": "Find the minimum value in the array [4, 9, 2, 15, 7].",
                "expectedOutput": `2`,
                "input": `
{
  "values": [4, 9, 2, 15, 7]
}`
              }
            },
            {
              "id": "pow",
              "title": "2.5.7 - pow()",
              "content": "Returns the base to the exponent power.",
              "codeExample": {
                "input": `
{
  "base": 2,
  "exponent": 3
}`,
                "script": `$Math.pow($base, $exponent)`,
                "output": `8`
              },
              "exercise": {
                "description": "Calculate 5 raised to the power of 2.",
                "expectedOutput": `25`,
                "input": `
{
  "base": 5,
  "exponent": 2
}`
              }
            },
            {
              "id": "sqrt",
              "title": "2.5.8 - sqrt()",
              "content": "Returns the square root of a number.",
              "codeExample": {
                "input": `
{
  "value": 16
}`,
                "script": `$Math.sqrt($value)`,
                "output": `4`
              },
              "exercise": {
                "description": "Find the square root of 25.",
                "expectedOutput": `5`,
                "input": `
{
  "number": 25
}`
              }
            },
            {
              "id": "random",
              "title": "2.5.9 - random()",
              "content": "Returns a random number between 0 (inclusive) and 1 (exclusive).",
              "codeExample": {
                "input": `
{}`,
                "script": `$Math.random()`,
                "output": `"[a random number between 0 and 1, e.g., 0.723]"`
              },
              "exercise": {
                "description": "Generate a random number between 0 and 1 (note: output will vary).",
                "expectedOutput": `"[a random number between 0 and 1]"`,
                "input": `
{}`
              }
            }
          ]
        },
        {
          id: 'date-functions',
          title: '2.6 - Date Functions',
          content: `Date functions in SnapLogic provide comprehensive capabilities for working with dates and times. These functions help you parse, format, manipulate, and compare dates.

Available Date Functions:
• Static Methods
• Local Parsing
• Getters
• UTC Getters
• Formatting
• Plus Methods
• Minus Methods
• With Methods`,
          subTopics:[
            {
              "id": "static-methods",
              "title": "2.6.1 - Static Date Methods",
              "content": "Static methods available on the Date object for creating and parsing dates.\n\nMethods:\n- Date.now(): Current timestamp\n- Date.parse(): Parse date string\n- Date.UTC(): Create UTC date",
              "codeExample": {
                "input": `
none
          `,
                "script": `$Date.now()
$Date.parse("2024-03-28T14:30:00.000Z")
$Date.UTC(2024, 2, 28, 14, 30, 0)`,
                "output": `1711633800000
1711633800000
1711633800000`
              },
              "exercise": {
                "description": "Parse the date string '2025-01-15T10:00:00.000Z' to a timestamp.",
                "expectedOutput": `1736935200000`,
                "input": `
{
  "dateString": "2025-01-15T10:00:00.000Z"
}`
              }
            },
            {
              "id": "local-parsing",
              "title": "2.6.2 - Local Date/Time Parsing",
              "content": "Methods for parsing local date and time strings.\n\nMethods:\n- LocalDateTime.parse(): Parse local date and time\n- LocalTime.parse(): Parse local time",
              "codeExample": {
                "input": `
{
  "dateTime": "2024-03-28T14:30:00",
  "time": "14:30:00"
}`,
                "script": `$LocalDateTime.parse($dateTime)
$LocalTime.parse($time)`,
                "output": `undetermined`
              },
              "exercise": {
                "description": "Parse the local date and time string '2025-06-10T09:15:00'.",
                "expectedOutput": `undetermined`,
                "input": `
{
  "dateTime": "2025-06-10T09:15:00"
}`
              }
            },
            {
              "id": "getters",
              "title": "2.6.3 - Date Getters",
              "content": "Methods for getting various components of a date.\n\nMethods:\n- getDate(): Day of month (1-31)\n- getDay(): Day of week (0-6)\n- getMonth(): Month (0-11)\n- getFullYear(): Year\n- getHours(): Hours\n- getMinutes(): Minutes\n- getSeconds(): Seconds",
              "codeExample": {
                "input": `
{
  "date": "2024-03-28T14:30:00.000Z"
}`,
                "script": `$date.getDate()
$date.getDay()
$date.getMonth()
$date.getFullYear()
$date.getHours()
$date.getMinutes()
$date.getSeconds()`,
                "output": `28
4
2
2024
14
30
0`
              },
              "exercise": {
                "description": "Get the day of the month and year from the date '2025-07-15T08:45:00.000Z'.",
                "expectedOutput": `15
2025`,
                "input": `
{
  "date": "2025-07-15T08:45:00.000Z"
}`
              }
            },
            {
              "id": "utc-getters",
              "title": "2.6.4 - UTC Date Getters",
              "content": "Methods for getting UTC components of a date.\n\nMethods:\n- getUTCDate(): UTC day of month\n- getUTCDay(): UTC day of week\n- getUTCMonth(): UTC month\n- getUTCFullYear(): UTC year\n- getUTCHours(): UTC hours",
              "codeExample": {
                "input": `
{
  "date": "2024-03-28T14:30:00.000Z"
}`,
                "script": `$date.getUTCDate()
$date.getUTCDay()
$date.getUTCMonth()
$date.getUTCFullYear()
$date.getUTCHours()`,
                "output": `28
4
2
2024
14`
              },
              "exercise": {
                "description": "Get the UTC month and hours from the date '2025-08-20T16:00:00.000Z'.",
                "expectedOutput": `7
16`,
                "input": `
{
  "date": "2025-08-20T16:00:00.000Z"
}`
              }
            },
            {
              "id": "formatting",
              "title": "2.6.5 - Date Formatting",
              "content": "Methods for converting dates to strings in various formats.\n\nMethods:\n- toString(): Convert to string\n- toLocaleDateString(): Format as local date\n- toLocaleTimeString(): Format as local time\n- toLocaleDateTimeString(): Format as local date and time",
              "codeExample": {
                "input": `
{
  "date": "2024-03-28T14:30:00.000Z"
}`,
                "script": `$date.toString()
$date.toLocaleDateString({"format": "YYYY-MM-DD"})
$date.toLocaleTimeString({"locale": "en-US"})
$date.toLocaleDateTimeString({"format": "YYYY-MM-DD HH:mm:ss"})`,
                "output": `"Thu Mar 28 2024 14:30:00 GMT+0000 (Coordinated Universal Time)"
"2024-03-28"
"2:30:00 PM"
"2024-03-28 14:30:00"`
              },
              "exercise": {
                "description": "Format the date '2025-09-10T13:15:00.000Z' as a local date string in 'YYYY-MM-DD' format.",
                "expectedOutput": `"2025-09-10"`,
                "input": `
{
  "date": "2025-09-10T13:15:00.000Z"
}`
              }
            },
            {
              "id": "plus-methods",
              "title": "2.6.6 - Date Addition Methods",
              "content": "Methods for adding time units to a date.\n\nMethods:\n- plusYears(): Add years\n- plusMonths(): Add months\n- plusDays(): Add days\n- plusHours(): Add hours\n- plusMinutes(): Add minutes\n- plusSeconds(): Add seconds",
              "codeExample": {
                "input": `
{
  "date": "2024-03-28T14:30:00.000Z"
}`,
                "script": `$date.plusYears(1)
$date.plusMonths(2)
$date.plusDays(5)
$date.plusHours(3)
$date.plusMinutes(45)`,
                "output": `2025-03-28T14:30:00.000Z
2024-05-28T14:30:00.000Z
2024-04-02T14:30:00.000Z
2024-03-28T17:30:00.000Z
2024-03-28T15:15:00.000Z`
              },
              "exercise": {
                "description": "Add 3 days and 2 hours to the date '2025-10-01T09:00:00.000Z'.",
                "expectedOutput": `2025-10-04T11:00:00.000Z`,
                "input": `
{
  "date": "2025-10-01T09:00:00.000Z"
}`
              }
            },
            {
              "id": "minus-methods",
              "title": "2.6.7 - Date Subtraction Methods",
              "content": "Methods for subtracting time units from a date.\n\nMethods:\n- minusYears(): Subtract years\n- minusMonths(): Subtract months\n- minusDays(): Subtract days\n- minusHours(): Subtract hours\n- minusMinutes(): Subtract minutes",
              "codeExample": {
                "input": `
{
  "date": "2024-03-28T14:30:00.000Z"
}`,
                "script": `$date.minusYears(1)
$date.minusMonths(2)
$date.minusDays(5)
$date.minusHours(3)
$date.minusMinutes(45)`,
                "output": `2023-03-28T14:30:00.000Z
2024-01-28T14:30:00.000Z
2024-03-23T14:30:00.000Z
2024-03-28T11:30:00.000Z
2024-03-28T13:45:00.000Z`
              },
              "exercise": {
                "description": "Subtract 1 month and 4 hours from the date '2025-11-15T12:00:00.000Z'.",
                "expectedOutput": `2025-10-15T08:00:00.000Z`,
                "input": `
{
  "date": "2025-11-15T12:00:00.000Z"
}`
              }
            },
            {
              "id": "with-methods",
              "title": "2.6.8 - Date Setting Methods",
              "content": "Methods for setting specific components of a date.\n\nMethods:\n- withYear(): Set year\n- withMonth(): Set month\n- withDayOfMonth(): Set day of month\n- withHourOfDay(): Set hour\n- withMinuteOfHour(): Set minute\n- withSecondOfMinute(): Set second",
              "codeExample": {
                "input": `
{
  "date": "2024-03-28T14:30:00.000Z"
}`,
                "script": `$date.withYear(2025)
$date.withMonth(6)
$date.withDayOfMonth(15)
$date.withHourOfDay(10)
$date.withMinuteOfHour(45)
$date.withSecondOfMinute(30)`,
                "output": `2025-03-28T14:30:00.000Z
2024-07-28T14:30:00.000Z
2024-03-15T14:30:00.000Z
2024-03-28T10:30:00.000Z
2024-03-28T14:45:00.000Z
2024-03-28T14:30:30.000Z`
              },
              "exercise": {
                "description": "Set the year to 2026 and the hour to 16 for the date '2025-12-01T09:15:00.000Z'.",
                "expectedOutput": `2026-12-01T16:15:00.000Z`,
                "input": `
{
  "date": "2025-12-01T09:15:00.000Z"
}`
              }
            }
          ]
        },
        {
          id: 'json-functions',
          title: '2.7 - JSON Functions',
          content: `JSON functions in SnapLogic provide methods for parsing and stringifying JSON data. These functions help you convert between JSON strings and JavaScript objects.

          Available JSON Functions:
          • JSON.parse()
          • JSON.stringify()`,
          subTopics: [
            {
              "id": "parse",
              "title": "2.7.1 - JSON.parse()",
              "content": "Parses a JSON string and returns a JavaScript object.",
              "codeExample": {
                "input": `
{
  "jsonString": "{
    \"name\": \"John\", 
    \"age\": 30, \"city\": 
    \"New York\"
      }",
  "arrayString": "[1, 2, 3, \"four\", true, null]",
  "nestedString": "{
    \"users\": [
    {\"id\": 1, \"name\": \"Alice\"}, 
    {\"id\": 2, \"name\": \"Bob\"}
  ]
  }"
}`,
                "script": `$JSON.parse($jsonString)
$JSON.parse($arrayString)
$JSON.parse($nestedString)`,
                "output": `{ "name": "John", "age": 30, "city": "New York" }
[1, 2, 3, "four", true, null]
{ 
"users": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" }
     ] 
}`
              },
              "exercise": {
  "description": "Parse the JSON string '{\"product\": \"Laptop\", \"price\": 999.99, \"inStock\": true}' into a JavaScript object.",
  "expectedOutput": `{ "product": "Laptop", "price": 999.99, "inStock": true }`,
  "input": `{
    "jsonString": "{\\"product\\": \\"Laptop\\", \\"price\\": 999.99,\\"inStock\\": true}"
  }`
}
            },
            {
              "id": "stringify",
              "title": "2.7.2 - JSON.stringify()",
              "content": "Converts a JavaScript value to a JSON string.",
              "codeExample": {
                "input": `
{
  "object": {
    "id": 123,
    "status": "active",
    "tags": ["important", "urgent"]
        },
  "nested": {
    "department": "IT",
    "employees": [
      { "id": 1, "name": "Alice", "role": "Developer" },
      { "id": 2, "name": "Bob", "role": "Designer" }
            ]
    }
}`,
                "script": `$JSON.stringify($object)
$JSON.stringify($nested)`,
                "output": `{"id":123,"status":"active","tags":["important","urgent"]}
{
  "department":"IT",
  "employees":[
      {
       "id":1,
       "name":"Alice",
       "role":"Developer"
      },
      {
       "id":2,
       "name":"Bob",
       "role":"Designer"
      }
    ]
}`
              },
              "exercise": {
                "description": "Convert the object { \"title\": \"Book\", \"pages\": 250, \"authors\": [\"Jane\", \"Doe\"] } to a JSON string.",
                "expectedOutput": `{"title":"Book","pages":250,"authors":["Jane","Doe"]}`,
                "input": `
{
  "data": {
    "title": "Book",
    "pages": 250,
    "authors": ["Jane", "Doe"]
      }
}`
              }
            }
          ]
        },
        {
          id: 'Other Functions',
          title: '2.8 - Other Functions',
          content: `This section covers additional functions in SnapLogic that enhance data processing, transformation, and pattern matching capabilities.

Available Other Functions:
• Match Operator
• Mapper
• JSONPath Expressions`,
          subTopics: [
            {
              "id": "match-operator",
              "title": "2.8.1 - Match Operator",
              "content": "The match operator in SnapLogic provides pattern matching capabilities for evaluating conditions and transforming data based on patterns. It supports object matching, string patterns, and value comparisons.",
              "codeExample": {
                "input": `
{
  "user": {
    "type": "admin",
    "active": true,
    "level": 4
          },
    "items": [
      {"status": "completed", "price": 0},
      {"status": "in-progress", "price": 100},
      {"status": "pending", "price": 0}
            ],
    "transaction": {
      "amount": 6000,
      "status": "pending"
          },
      message": "ERROR: Database connection failed"
}`,
            "script": `
match $.user {
  { "type": "admin", "active": true } => "Active Administrator",
  { "type": "user", "level": 3..5 } => "Advanced User",
  { "type": "guest" } => "Guest Access",
  _ => "Unknown User Type"
}
          
match $.message {
  /^ERROR:/ => "Error Message",
  /^WARN:/ => "Warning Message",
  /^INFO:/ => "Info Message",
  /^DEBUG:/ => "Debug Message",
   _ => "Unknown Message Type"
}`,
                "output": `"Active Administrator"
"Error Message"`
              },
              "exercise": {
                "description": "Use the match operator to categorize a user with type 'guest' and check a message starting with 'INFO:'.",
                "expectedOutput": `"Guest Access"
"Info Message"`,
                "input": `
{
  "user": {
    "type": "guest",
    "active": false
      },
  "message": "INFO: System started successfully"
}`
              }
            },
            {
              "id": "mapper",
              "title": "2.8.2 - Mapper",
              "content": "The Mapper in SnapLogic provides powerful data transformation capabilities to map source data to target structures. It supports direct mapping, JSON path expressions, and nested field mapping.",
              "codeExample": {
                "input": `
[
  {
    "ACTION": "C",
    "MAST_UPL": [
      {
        "PERNR": 50060976,
        "NACHN": "Williams",
        "VORNA": "Jo-Anne",
        "USRID_LONG": "jo-anne.williams@global.ntt"
          }
        ]
    }
]`,
                "script": `
{
  "name": "John",
  "employeeinfo.employeename": "jsonPath($, '$ACTION')",
  "employeeinfo.employeeid": "$MAST_UPL[0].PERNR",
  "Action": "$ACTION",
  "jsonPath($, '$detail[*].name')": "Jo-Anne Modified"
}`,
                "output": `
{
  "name": "John",
  "employeeinfo": {
    "employeename": "C",
    "employeeid": 50060976
        },
  "Action": "C",
  "detail": [
      {
        "name": "Jo-Anne Modified"
      }
    ]
}`
              },
              "exercise": {
                "description": "Map the input to create an object with a nested 'person' structure containing 'id' and 'email' from the input data.",
                "expectedOutput": `
{
  "person": {
    "id": 12345,
    "email": "jane.doe@example.com"
        },
  "operation": "U"
}`,
             "input": `
[
  {
    "OPERATION": "U",
    "DATA": [
      {
        "ID": 12345,
        "EMAIL": "jane.doe@example.com"
      }
    ]
  }
]`
              }
            },
            {
              "id": "jsonpath-expressions",
              "title": "2.8.3 - JSONPath Expressions",
              "content": "JSONPath expressions in SnapLogic provide a way to query and extract data from JSON structures. They support various operators for navigating through JSON objects and performing string operations.",
              "codeExample": {
                "input": `
{
  "TYPE": "",
  "CODE": "",
  "MESSAGE": "RP 060  personnel number(s) could not be locked by TANYAWEBER",
  "LOG_NO": "",
  "LOG_MSG_NO": 0,
  "MESSAGE_V1": "",
  "MESSAGE_V2": "",
  "MESSAGE_V3": "",
  "MESSAGE_V4": ""
}`,
                "script": `jsonPath($, "$MESSAGE")[0].contains('personnel number(s) could not be locked')`,
                "output": `true`
              },
              "exercise": {
                "description": "Use a JSONPath expression to check if the 'status' field contains 'success'.",
                "expectedOutput": `true`,
                "input": `
{
  "status": "Operation completed with success",
  "code": 200
}`
              }
            }
          ]
        },
        
      ]
    },
    {
      id: 'advanced-features',
      title: '3 - Advanced Features',
      content: `SnapMapper offers advanced features for complex integration scenarios:
  
  1. Custom Functions
     • Function definition
     • Parameter handling
     • Error management
     • Recursion support
  
  2. Advanced Expressions
     • Complex conditions
     • Pattern matching
     • Regular expressions`,
      subTopics:[
        {
          id: 'benefits-for-users',
          title: '3.1 - Benefits for Users',
          content: `SnapMapper provides numerous benefits for users:
      
      1. Development Efficiency
         • Rapid prototyping
         • Immediate feedback
         • Code reusability
         • Built-in best practices
      
      2. Learning and Growth
         • Interactive tutorials
         • Comprehensive documentation
         • Example library
         • Community support
      
      3. Collaboration
         • Share expressions
         • Team development
         • Version control
         • Knowledge sharing
    `,
          
        },
        {
          id: 'future-enhancements',
          title: '3.2 - Future Enhancements',
          content: `Upcoming features and improvements planned for SnapLogicMapper:
      
      1. Enhanced UI/UX
         • Dark mode support
         • Customizable themes
         • Improved navigation
         • Enhanced accessibility
      
      2. Advanced Features
         • AI-powered suggestions
         • Advanced debugging tools
         • Complex function and script Handling
         
      3. Collaboration Features
         • Real-time collaboration
         • Team workspaces
        `,
          
        }
      ]
    }
    
  ];