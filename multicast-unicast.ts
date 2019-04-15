import { Observable, interval, Subject } from 'rxjs';
import { map, take, multicast, refCount, publish } from 'rxjs/operators';
// Multicast vs Unicast

function getRandom() {
    return Math.floor(Math.random() * Math.floor(100));
}

// 👉 promise is unicast
const promise = new Promise(resolve => {
    resolve(getRandom());
});
promise.then(result => console.log('promise', result));

setTimeout(()=>{
  promise.then(result => console.log('promise 5ms', result));
}, 500)

// Output: (it will always produce the same number)

const int = interval(1000).pipe(
  map(x=>getRandom()),
  take(1)
)

// 👉 observable is Unicast
int.subscribe(x=>console.log('subscribe directly', x))
setTimeout(()=>{
  int.subscribe(x=>console.log('after 5ms', x))
}, 500)

// Output: (will produce a different number between subscription)
