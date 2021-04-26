import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { tap, throttleTime } from 'rxjs/operators';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';
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
  courseId: string;

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {
    setRxJsLoggingLevel(RxJsLoggingLevel.DEBUG);
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`).pipe(
      debug(RxJsLoggingLevel.INFO, 'course value')
    );
    this.lessons$ = this.loadLessons();

    forkJoin([this.course$, this.lessons$])
      .pipe(
        tap(([course, lessons]) => {
          console.log('course', course);
          console.log('lessons', lessons);
        })
      )
      .subscribe();
    // this.lessons$ = createHttpObservable(
    //   `/api/lessons?courseId=${this.courseId}&pageSize=100`
    // ).pipe(map((res) => res.payload));
  }

  // ngAfterViewInit() {
  //   // const searchLessons$ = fromEvent<any>(
  //   this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
  //     map((event) => event.target.value),
  //     startWith(''),
  //     debug(RxJsLoggingLevel.TRACE, 'search'),
  //     // The DebounceTime operator enforces stability, similar to the ExhaustMap operator
  //     // that is used with DOM elements.
  //     // To use the DebounceTime operator, you would specify an interval and then any
  //     // data entering the input stream during the interval must remain stable to be
  //     // emitted by the observable. If new data enters the input stream then the previous data is ignored.

  //     // At the end of the interval, only the most recent data in the stream is emitted
  //     // by the observable

  //     // This solves the problem of Double entry in a TypeAhead from holding down the
  //     // shift key
  //     debounceTime(400),
  //     // The DistinctUntilChanged operator will emit only one value if 2 or more values in
  //     // the input stream are exactly the same
  //     distinctUntilChanged(),
  //     // We didn't have to use the Concat operator and 2 separate observables making HTTP
  //     // requests (one for the initial value, and the other for the stream) as we had done
  //     // previously. We could have just used the startsWith operator to initialize the stream
  //     // with a value that would be used for the initial HTTP request
  //     // concatMap((event) => this.filterCourse(event.target.value)),
  //     // map((res) => (this.lessons$ = of(res.payload)))

  //     // SwitchMap will cancel an active observable i.e an ongoing HTTP requests if new data
  //     // enters the input stream. It will then create and subscribe to a new output observable with
  //     // the latest data from the input stream i.e it will send a new HTTP request with the latest data
  //     // from the input stream. Compare switchMap vs concatMap and mergeMap in your udemy course notes
  //     switchMap((value) => this.loadLessons(value)),
  //     debug(RxJsLoggingLevel.DEBUG, 'lessons value')
  //   );

  //   // const initialLessons$ = this.loadLessons();
  //   // // TODO: Figure out why the order of the parameters to this concat function matters!!!
  //   // this.lessons$ = concat(initialLessons$, searchLessons$);
  // }

  ngAfterViewInit() {
    fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        throttleTime(500)
      )
      .subscribe(console.log);
  }

  loadLessons(search = '') {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map((res) => res.payload));
  }

  //   filterCourse(search) {
  //     const url = `/api/lessons?courseId=${this.courseId}&filter=${search}`;

  //     return createHttpObservable(url);
  //   }
}
