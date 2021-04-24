import { Component, OnInit } from '@angular/core';
import { noop, Observable } from 'rxjs';

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

    const http$ = new Observable((observer) => {
      fetch('/api/courses')
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

    http$.subscribe({
      next: (data) => console.dir(data),
      error: noop,
      complete: () => console.log('completed'),
    });
  }
}
