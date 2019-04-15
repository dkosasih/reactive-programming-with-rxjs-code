import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

const promise = new Promise(resolve => {
  console.log("promise");
  resolve("promise");
});
console.log("just a line in the code");
promise.then((x) => console.log("print", x));

// Output: 
// promise
// just a line in the code
// print promise

const observable = of("observable").pipe(
  tap(x => console.log(x))
);
console.log("just a line in the code");
observable.subscribe(
  (x) => console.log("print ", x)
);

  // Output: 
  // just a line in the code
  // observable
  // print observable