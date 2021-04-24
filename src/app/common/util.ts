import { Observable } from 'rxjs/internal/Observable';
import { Course } from '../model/course';

export function createHttpObservable(url: string) {
  return new Observable<{ payload: Course[] }>((observer) => {
    fetch(url)
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
  });
}
