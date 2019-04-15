import { Observable, interval, Subject } from 'rxjs';
import { map, take, multicast, refCount, publish, publishReplay, share, tap, shareReplay } from 'rxjs/operators';

function getRandom() {
  return Math.floor(Math.random() * Math.floor(100));
}

const int = interval(100).pipe(
  map(x => getRandom() + ' ;interval: ' + x),
  take(10)
)

// 👉 Subject: Make it hot
export const withSubject = () => {
  const sub = new Subject();
  sub.subscribe((x) => console.log('sub1', x));

  setTimeout(() => {
    sub.subscribe((x) => console.log('sub2 after .5ms', x));
  }, 50);

  int.subscribe(sub);
}

// 👉 multicast operator make it more readable
export const multicastWithSubject = () => {
  const multi = int.pipe(
    multicast(new Subject())
  );

  multi.subscribe((x) => console.log('multi1', x));

  setTimeout(() => {
    multi.subscribe(x => console.log('multi after .5ms', x))
  }, 50)

  multi.connect();
}

// 👉 publish is a thin wrapper which call multicast and pass the Subject along with it
export const withPublish = () => {
  const pub = int.pipe(
    publish()
  );

  pub.subscribe((x) => console.log('pub', x));

  setTimeout(() => {
    pub.subscribe((x) => console.log('pub after 5ms', x));
  }, 510);

  pub.connect();
}

// 👉 publish operator with refCount() to connect the observable automatically
// when first subscription is made - it will start emit, and count up for the next.
// after that, if all subscription dropped of - it will automatically unsubscribe and complete from the source
export const withPublishRefCount = () => {
  const publishRef = int.pipe(
    publish(),
    refCount()
  );

  // first subscription - straight away
  const subs1 = publishRef.subscribe({
    next: (x) => console.log('publishRef', x),
    complete: () => console.log('sub1 completed')
  });

  // second subscription .9ms later - this expect the same value as first subs
  // 1.1s later both getting unsubscribed - see below
  // because of the refCount - the source is unsubscribed
  let subs2;
  setTimeout(() => {
    subs2 = publishRef.subscribe({
      next: x => console.log('publishRef after .9ms', x),
      complete: () => console.log('sub2 completed')
    })
  }, 90);

  setTimeout(() => {
    subs1.unsubscribe();
    subs2.unsubscribe();
    console.log('subscription unsubscribed');
  }, 110);

  // this subscription after refCount() dropped to 0
  // which means new subscription to the source is being made
  setTimeout(() => {
    publishRef.subscribe(x => console.log('publishRef after 1.5ms', x))
  }, 150)
  // same as above
  setTimeout(() => {
    publishRef.subscribe(x => console.log('publishRef after --- 1.7ms', x))
  }, 170)

  // late subscription after 5ms will not receive anything because source has been completed
  setTimeout(() => {
    publishRef.subscribe(x => console.log('publishRef after -------- 1.15sec', x))
  }, 1156)
}

// 👉 publishReplay: replay the last value even after the source completes
export const withPublishReplay = () => {
  const pubRep = int.pipe(
    publishReplay(1),
    refCount()
  );

  // first subscription - straight away
  const subs11 = pubRep.subscribe((x) => console.log('pubRep', x));

  // second subscription 900ms later - this expect the same value as first subs
  // 1.1s later both getting unsubscribed - see below
  // which made the refCount drops to 0 - the source is unsubscribed
  let subs21;
  setTimeout(() => {
    subs21 = pubRep.subscribe(x => console.log('pubRep after 9ms', x))
  }, 90)

  setTimeout(() => {
    subs11.unsubscribe();
    subs21.unsubscribe();
  }, 110);

  // this subscription after refCount() dropped to 0
  // which means new subscription to the source is being made
  setTimeout(() => {
    pubRep.subscribe(x => console.log('pubRep after 15ms', x))
  }, 150)
  // same as above
  setTimeout(() => {
    pubRep.subscribe(x => console.log('pubRep after 17ms', x))
  }, 170)

  // late subscription will still received last produced values
  setTimeout(() => {
    pubRep.subscribe(x => console.log('pubRep after 1.15 secs', x))
  }, 1156)
}

// 👉 Share is and operator that does publish and refCount together - however share is using factory function 
// under the hood to create new subject everytime - which means if there is any subscription 
// is made after refCount drops to 0 - new subject will be created and perform a new subscription to the observable
export const withShare = () => {
  const shr = int.pipe(
    share()
  );

  shr.subscribe((x) => console.log('shr', x));

  setTimeout(() => {
    shr.subscribe((x) => console.log('shr after .5ms', x));
  }, 510);

  // the factory will create new subject and subscribe to it and start from the beginning
  setTimeout(() => {
    shr.subscribe((x) => console.log('shr after 1.1s', x));
  }, 1100);
}

// 👉 shareReplay - difference to publishReplay, refCount is that after the last subscription dropped to 0
// it will not unsubscribe from the source - the stream continues until the source completed on its own
export const withShareReplay = (x) => {
  const shrRpl = int.pipe(
    shareReplay(x)
  );

  // first subscription - straight away
  const subs11 = shrRpl.subscribe((x) => console.log('shareReplay', x));

  // second subscription 900ms later - this expect the same value as first subs
  // 1.1s later both getting unsubscribed - see below
  // which made the refCount drops to 0 - the source CONTNUES
  let subs21;
  setTimeout(() => {
    subs21 = shrRpl.subscribe(x => console.log('shareReplay after 9ms', x))
  }, 90)

  setTimeout(() => {
    subs11.unsubscribe();
    subs21.unsubscribe();
  }, 110);

  // After 4ms - source tick continues until the end
  setTimeout(() => {
    shrRpl.subscribe((x) => console.log('shareReplay after 4ms', x));
  }, 400);

// any subscription after source completed will get the replay value of x depending on the parameter
  setTimeout(() => {
    shrRpl.subscribe((x) => console.log('shareReplay after 1.1s', x));
  }, 1100);
}
