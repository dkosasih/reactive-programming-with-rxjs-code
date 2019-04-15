import { Observable } from 'rxjs';

// Promise
const promise = new Promise(resolve => {
    setTimeout(() => {
        console.log("Promise resolve");
        resolve();
    }, 1000);
});
promise.then(() => console.log("do something after resolve"));

// Output: 
// Promise resolve
// do something after resolve

// Observable
const observable = new Observable(observer => {
    setTimeout(() => {
        console.log("Async process return a value");
        observer.next();
    }, 2000);
});
const subscription = observable.subscribe(() => console.log("Handling processed value"));
subscription.unsubscribe();

// Output:
// Async process return a value