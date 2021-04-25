import { Observable } from 'rxjs/internal/Observable';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';

// Intersection types use & not | 🤦‍♂️
type CourseData = { payload: Course[] } & Course[] & Course;
type LessonData = { payload: Lesson[] } & Lesson[] & Lesson;

export function createHttpObservable(url: string) {
  return new Observable<CourseData & LessonData>((observer) => {
    // The AbortController in this example is provided by the fetch API
    const controller = new AbortController();
    // The AbortController signal sends a signal to the browser to cancel the HTTP request when it emits a value of true
    const signal = controller.signal;

    fetch(url, { signal })
      .then((response) => {
        // Manually check for error response since Fetch API will
        // only treat network errors as errors
        // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_that_the_fetch_was_successful
        if (!response.ok) {
          return observer.error(response.statusText);
        }

        return response.json();
      })
      .then((data) => {
        observer.next(data);
        observer.complete();
      })
      .catch((err) => {
        // Fetch API only catches network errors!!!
        // Reference: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
        observer.error(err);
      });

    // Return the cancellation function that is used to cancel a subscription
    return () => controller.abort();
  });
}
