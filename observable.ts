// Observer interface
interface Observer<T> {
  next(value: T): void;
  error(err: any): void;
  complete(): void;
}

// It's sort of observer wrapper that implements Observer to implements the logic of 
// the Observable e.g. no more next after completion or error
class Subscriber<T> implements Observer<T> {
  isStopped = false;

  constructor(
    private destination: Observer<T>, 
    private subscription: Subscription) {
     
  }

  next(value: T) {
    if (!this.isStopped) {
      this.destination.next(value);
    }
  }

  error(err: any) {
    if (!this.isStopped) {
      this.isStopped = true;
      this.destination.error(err);
      this.subscription.unsubscribe();
    }
  }

  complete() {
    if (!this.isStopped) {
      this.isStopped = true;
      this.destination.complete();
      this.subscription.unsubscribe();
    }
  }
}

// a subscription class to enable cleaning up in a bulk and cancelling mechanism 
class Subscription {
  private subscriptions: (() => void)[] = [];

  add(teardown: () => void) {
    this.subscriptions.push(teardown);
  }

  unsubscribe() {
    for (const teardown of this.subscriptions) {
      teardown();
    }
    this.subscriptions = [];
  }
}

// Observable basically is the orchestrator of the classes above
// creating new Subscription class which a subscriber class which also take a plain observer 
// so what it can protect the 'misuse' of observer.
class Observable<T> {
  constructor(private init: (observer: Observer<T>) => (() => void)) {}

  subscribe(observer: Observer<T>): Subscription {
    const subscription = new Subscription();
    const subscriber = new Subscriber(observer, subscription);
    subscription.add(this.init(subscriber));

    return subscription; 
  }
}

const myObservable = new Observable((observer: Observer<number>) => {
  let i = 0;
  const id = setInterval(() => {
    observer.next(i++);
    if (i > 5) {
      observer.complete();
    }
  }, 100);

  return () => {
    clearInterval(id);
  }
})

const subscription = myObservable
  .subscribe({
    next(value) { console.log(value); },
    error(err) { console.error(err); },
    complete() { console.log('done'); },
  });

setTimeout(() => {
  subscription.unsubscribe();
}, 2000);