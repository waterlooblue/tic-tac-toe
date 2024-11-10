import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Square } from '../../model/square';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss'
})
export class SquareComponent {
  @Input() props: Square;
  @Output() clickEvent = new EventEmitter<number>();
  sendClickEvent() {
    this.clickEvent.emit(this.props.position);
  }
}
