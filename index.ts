console.clear();

// Invoke cancellable example
// import './cancellable';

// Invoke lazy example
// import './lazy';

// Invoke multicast - unicast example
// import './multicast-unicast';

// Invoke Observable example
 import './observable';

// Invoke higher order Observable example
 import {mm, sm, ma, sa,cm, ca, e, em, doubleSubscribe} from './higher-order-observable';
// doubleSubscribe();
// ma();
// mm();
// sa();
// sm();
// ca();
// cm();
// e();
// em();

// Invoke multicast example
import {withSubject, multicastWithSubject, withPublish, withPublishRefCount, withPublishReplay, withShare, withShareReplay} from './multicast';
// withSubject();
// multicastWithSubject();
// withPublish();
// withPublishRefCount();
// withPublishReplay();
// withShare();
// withShareReplay(2);