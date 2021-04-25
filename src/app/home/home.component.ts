import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
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
      tap(() => console.log('HTTP Request executed')),
      map((res) => res.payload),
      shareReplay(),
      catchError((err) => of([]))
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
