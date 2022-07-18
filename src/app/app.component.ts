import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  title = 'yellow-box';

  rectX: number = 0;
  rectY: number = 0;

  curX?: number;
  curY?: number;


  @ViewChild('inner')
  inner!: ElementRef;

  ngAfterViewInit(): void {
    const subscribeToMove = () => {
      fromEvent(this.inner.nativeElement, 'mousedown')
        .pipe(
          tap((event: any) => {
            (this.curX = event.clientX), (this.curY = event.clientY);
          }),
          switchMap((e) =>
            fromEvent(window, 'mousemove').pipe(
              tap((e: any) => e.preventDefault())
            )
          ),
          takeUntil(fromEvent(window, 'mouseup'))
        )
        .subscribe({
          next: (e: MouseEvent) => {

            const dx = e.clientX - this.curX!;
            const dy = e.clientY - this.curY!;

            this.rectX += dx;
            this.rectY += dy;

            [this.curX, this.curY] = [e.clientX, e.clientY];
          },
          complete: () => {
            subscribeToMove();
          },
        });
    };

    subscribeToMove();
  }
}
