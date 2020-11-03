/**
 *  We could determine the DTO schema by using TypeScript interfaces, or by simple classes.
 *  Interestingly, we recommend using classes here.
 *  Why?
 *  Classes are part of the JavaScript ES6 standard,
 *  and therefore they are preserved as real entities in the compiled JavaScript.
 *  On the other hand, since TypeScript interfaces are removed during the transpilation,
 *  Nest can't refer to them at runtime.
 *  This is important because features such as Pipes enable additional possibilities when they have access to the metatype of the variable at runtime.
 *
 */

export class UserInterface {
  name: string;
  age: number;
}
