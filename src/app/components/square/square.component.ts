import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss'
})
export class SquareComponent {
  @Input() props: { square: number, enabled: boolean, value: string }
  @Output() clickEvent = new EventEmitter<number>();
  sendClickEvent() {
    this.clickEvent.emit(this.props.square);
  }
}
