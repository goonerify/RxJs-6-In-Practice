import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<{ payload: Course[] }>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const courseId = this.route.snapshot.params['id'];
    this.course$ = createHttpObservable(`/api/courses/${courseId}`);
    this.lessons$ = createHttpObservable(
      `/api/lessons?courseId=${courseId}&pageSize=100`
    ).pipe(map((res) => res.payload));
  }

  ngAfterViewInit() {
    fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        // The DebounceTimeoperator enforces stability, similar to the ExhaustMap operator
        // that is used with DOM elements.
        // To use the DebounceTimeoperator, you would specify an interval and then any
        // data entering the input stream during the interval must remain stable to be
        // emitted by the observable. If new data enters the input stream then the previous data is ignored.

        // At the end of the interval, only the most recent data in the stream is emitted
        // by the observable

        // This solves the problem of Double entry in a TypeAhead from holding down the
        // shift key
        debounceTime(400),
        // The DistinctUntilChanged operator will emit only one value if 2 values in the input stream are exactly the same
        distinctUntilChanged()
        // concatMap((event) => this.filterCourse(event.target.value)),
        // map((res) => (this.lessons$ = of(res.payload)))
      )
      .subscribe(console.log);
  }

  //   filterCourse(value) {
  //     const courseId = this.route.snapshot.params['id'];
  //     const url = `/api/lessons?courseId=${courseId}&filter=${value}`;

  //     return createHttpObservable(url);
  //   }
}
