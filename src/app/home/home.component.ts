import { Component, OnInit } from '@angular/core';
import { noop } from 'rxjs';
import { map } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  beginnerCourses: Course[];
  advancedCourses: Course[];

  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    // A subscription is an instance of an observable.
    // Without subscribing to an observable, all you have
    // is a 'declaration' of the observable
    const courses$ = http$.pipe(map((res) => res.payload));

    courses$.subscribe({
      next: (data) => {
        this.beginnerCourses = data.filter(
          (course) => course.category === 'BEGINNER'
        );
        this.advancedCourses = data.filter(
          (course) => course.category === 'ADVANCED'
        );
      },
      error: noop,
      complete: () => console.log('completed'),
    });
  }
}
