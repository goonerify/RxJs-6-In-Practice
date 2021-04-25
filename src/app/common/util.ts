import { Observable } from 'rxjs/internal/Observable';
import { Course } from '../model/course';

export function createHttpObservable(url: string) {
  return new Observable<{ payload: Course[] }>((observer) => {
    // The AbortController in this example is provided by the fetch API
    const controller = new AbortController();
    // The AbortController signal sends a signal to the browser to cancel the HTTP request when it emits a value of true
    const signal = controller.signal;

    fetch(url, { signal })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        observer.next(data);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
      });

    // Return the cancellation function that is used to cancel a subscription
    return () => controller.abort();
  });
}
