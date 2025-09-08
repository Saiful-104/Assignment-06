// Ans-1

 var
  Function-scoped (accessible within the function it is declared in).
  Can be redeclared and reassigned.
  Hoisted (declaration moves to the top of its scope, but the value is not assigned).

let
 Block-scoped (accessible only within the {} block it is declared in).
 Can be reassigned, but cannot be redeclared in the same scope.
 Hoisted, but exists in a temporal dead zone (TDZ) until declared.

const
  Block-scoped.
  Cannot be reassigned (immutable binding).
  Cannot be redeclared in the same scope.
  Hoisted, but exists in a temporal dead zone (TDZ) until declared.

  // Ans-2 

 map()
  Returns a new array with the results of applying a function to each element.
  Does not modify the original array.

forEach()
  Executes a function on each element of an array.
  Does not return anything (undefined).
  Typically used for side effects like logging or updating external variables.

filter()
  Returns a new array containing only elements that satisfy a specified condition.
  Does not modify the original array.

  // Ans-3
  
Arrow Functions in ES6
  Arrow functions provide a shorter syntax to define functions.

  They do not have their own this, arguments, or super binding; they inherit from the surrounding scope.

  Useful for writing concise and readable code, especially in callbacks or array methods.

  //Ans-4

Destructuring Assignment in ES6
  Destructuring assignment allows you to extract values from arrays or objects into separate variables.

  It provides a concise syntax for unpacking values, making code cleaner and easier to read.

 Can be used with arrays, objects, function parameters, and even nested structures.

 //Ans-5

 Template Literals in ES6

  Template literals allow you to create strings with embedded expressions using backticks (`).

  They support multi-line strings and string interpolation (${expression}), making code cleaner.

  Unlike traditional string concatenation, template literals avoid using + operators and make complex strings easier to read.