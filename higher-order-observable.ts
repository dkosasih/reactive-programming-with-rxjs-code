import { of, fromEvent, interval } from 'rxjs';
import { mergeMap, map, mergeAll, switchAll, switchMap, tap, concatAll, exhaust, exhaustMap, concatMap, take} from 'rxjs/operators';

let counter = 0;
let clickString = '';
const click$ = fromEvent(document, 'click');
const interval$ = interval(1000).pipe(take(5));

// setup
const observable$ = click$.pipe(
  map(event => {
    clickString = `click ${counter++}`;
    return interval$;
  })
);

// Higher order observable concept
export const doubleSubscribe = () => {
  click$.subscribe(event => {
    clickString = `click ${counter++}`;
    interval$.subscribe(num => {
      console.log(clickString, num);
    });
  });
};

// mergeAll
export const ma = () => {
  observable$.pipe(
    tap(x=> clickString = 'mergeAll ' + clickString),
    mergeAll()
  ).subscribe(num => console.log(clickString, num));
};

// mergeMap
export const mm = () => {
  mergeMap
  const mm$ = click$.pipe(
    mergeMap(event => {
      clickString = `mergeMap click ${counter++}`;
      return interval$;
    })
  );
  mm$.subscribe(num => console.log(clickString, num));
};

// switchAll
export const sa = () => {
  observable$.pipe(
    tap(x=> clickString = 'switchAll ' + clickString),
    switchAll()
  ).subscribe(num => console.log(clickString, num));
};

// switchMap
export const sm = () => {
  const sm$ = click$.pipe(
    switchMap(event => {
      clickString = `switchMap click ${counter++}`;
      return interval$;
    })
  );
  sm$.subscribe(num => console.log(clickString, num));
};

// concatAll
export const ca = () => {
  observable$.pipe(
    tap(x=> clickString = 'concatAll ' + clickString),
    concatAll()
  ).subscribe(num => console.log(clickString, num));
};

// concatMap
export const cm = () => {
  const sm$ = click$.pipe(
    concatMap(event => {
      clickString = `concatMap click ${counter++}`;
      return interval$;
    })
  );
  sm$.subscribe(num => console.log(clickString, num));
};

// exhaust
export const e = () => {
  observable$.pipe(
    tap(x=> clickString = 'exhaust ' + clickString),
    exhaust()
  ).subscribe(num => console.log(clickString, num));
};

// exhaustMap
export const em = () => {
  const sm$ = click$.pipe(
    exhaustMap(event => {
      clickString = `exhaustMap click ${counter++}`;
      return interval$;
    })
  );
  sm$.subscribe(num => console.log(clickString, num));
};

