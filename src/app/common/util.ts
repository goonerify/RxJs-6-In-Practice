import { Observable } from 'rxjs/internal/Observable';

interface Payload {
  category: string;
  courseListIcon: string;
  description: string;
  iconUrl: string;
  id: number;
  lessonsCount: number;
  longDescription: string;
}

export function createHttpObservable(url: string) {
  return new Observable<{ payload: Payload[] }>((observer) => {
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
