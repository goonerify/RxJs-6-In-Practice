import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { delay, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    // A subscription is an instance of an observable.
    // Without subscribing to an observable, all you have
    // is a 'declaration' of the observable
    const courses$ = http$.pipe(
      // By placing catchError and finalize above shareReplay operator
      // We share the execution of the http$ observable between its
      // 2 subscriptions from the first operator in the observable chain
      // until the shareReplay operator
      // catchError((err) => throwError(err)),
      // finalize(() => console.log('finalize called')),
      tap(() => console.log('HTTP Request executed')),
      map((res) => res.payload),
      shareReplay(),
      // The RetryWhen operator will attempt to create a new stream and subscribe to it.
      // It will continue to attempt to do this until the stream no longer error out.
      // The first parameter is an error handler function that should return an observable
      // retryWhen((errors) => errors.pipe(delayWhen(() => timer(2000))))

      // In this case, the author did not need to use DelayWhen since he didn't return a
      // different delay interval for each item in the stream. He should have just used Delay instead
      retryWhen((errors) => errors.pipe(delay(2000)))
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses) => {
        return courses.filter((course) => course.category === 'BEGINNER');
      })
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === 'BEGINNER')
      )
    );

    // courses$.subscribe({
    //   next: (data) => {
    //     this.beginnerCourses = data.filter(
    //       (course) => course.category === 'BEGINNER'
    //     );
    //     this.advancedCourses = data.filter(
    //       (course) => course.category === 'ADVANCED'
    //     );
    //   },
    //   error: noop,
    //   complete: () => console.log('completed'),
    // });
  }
}
