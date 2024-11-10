import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SquareComponent } from '../square/square.component';
import { MovementsService } from '../../services/movements.service';
import { Movement } from '../../model/movement';
import { Square } from '../../model/square';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, SquareComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  // Initialize the board
  currentPlayer = 'x';
  isGameWon = false;
  isGameDraw = false;
  squares = [
    { position: 0, value: '', enabled: true },
    { position: 1, value: '', enabled: true },
    { position: 2, value: '', enabled: true },
    { position: 3, value: '', enabled: true },
    { position: 4, value: '', enabled: true },
    { position: 5, value: '', enabled: true },
    { position: 6, value: '', enabled: true },
    { position: 7, value: '', enabled: true },
    { position: 8, value: '', enabled: true }
  ];
  constructor(private movementsService: MovementsService) {
    
  }
  receiveClick ($event: number) {
    this.movementsService.addMove($event);
    this.setSquareValue($event);
    this.disableSquare($event);
    this.nextPlayer();
  }
  setSquareValue(position: number) {
    const square = this.squares.find(square => square.position === position);
    if(square != null) {
      square.value = this.currentPlayer;
    }
  }
  disableSquare(position: number) {
    const square = this.squares.find(square => square.position === position);
    if(square != null) {
      square.enabled = false;
    }
  }
  nextPlayer() {
    this.currentPlayer = this.movementsService.nextPlayer();
  }
  reset() {
    this.movementsService.resetBoard();
    this.squares.forEach((square => {
      square.enabled = true;
      square.value = ''
    }));
  }
  ngOnInit() {
    this.currentPlayer = this.movementsService.currentPlayer;
  }
}
