import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SquareComponent } from '../square/square.component';
import { MovementsService } from '../../services/movements.service';
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
  squares: Square[] = [
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
    this.movementsService.addMove({position: $event, player: this.currentPlayer});
    this.setSquareValue($event);
    this.disableSquare($event);
    this.isGameWon = this.movementsService.isGameWon(this.currentPlayer);
    this.isGameDraw = this.movementsService.isGameDraw() && !this.isGameWon;
    if (this.isGameWon) {
      this.disableAllSquares();
    } else {
      this.currentPlayer = this.movementsService.nextPlayer(this.currentPlayer);
    }
  }
  reset() {
    this.movementsService.resetBoard();
    this.squares.forEach((square => {
      square.enabled = true;
      square.value = ''
    }));
    this.isGameWon = false;
    this.isGameDraw = false;
  }
  private getSquareByPosition(position: number): Square | undefined {
    return this.squares.find(square => square?.position === position);
  }
  private setSquareValue(position: number) {
    const square = this.getSquareByPosition(position) || {position: 8, value: '', enabled: true};
    if(square != null) {
      square.value = this.currentPlayer;
    }
  }
  private disableSquare(position: number) {
    const square = this.getSquareByPosition(position);
    if(square != null) {
      square.enabled = false;
    }
  }
  private disableAllSquares(): void {
    this.squares.forEach(square => square.enabled = false);
  }
}
