import { Component, OnInit } from '@angular/core';
import { noop } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // const interval$ = interval(2000);
    // const sub = interval$.subscribe((val) => console.log('stream 1 => ' + val));
    // setTimeout(() => sub.unsubscribe(), 5000);
    // interval$.subscribe((val) => console.log('stream 2 => ' + val));
    // const timer$ = timer(3000, 1000);
    // timer$.subscribe((val) => console.log(val));
    // const click$ = fromEvent(document, 'click');
    // click$.subscribe((evt) => console.dir(evt));

    const http$ = createHttpObservable('/api/courses');

    // A subscription is an instance of an observable.
    // Without subscribing to an observable, all you have
    // is a 'declaration' of the observable
    const sub = http$
      .pipe(map((res) => res.payload))
      .subscribe((vals) => console.dir(vals));

    http$.subscribe({
      next: (data) => console.dir(data),
      error: noop,
      complete: () => console.log('completed'),
    });
  }
}
