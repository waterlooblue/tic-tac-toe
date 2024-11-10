import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SquareComponent } from '../square/square.component';
import { MovementsService } from '../../services/movements/movements.service';
import { ComputerService } from '../../services/computer/computer.service';
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
  playComputer = false;
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
  constructor(private movementsService: MovementsService, private computerService: ComputerService) { }
  receiveClick ($event: number) {
    this.playerMove($event);
    this.checkBoardForEnd();
  }
  togglePlayers(): void {
    this.playComputer = !this.playComputer;
  }
  reset() {
    this.movementsService.resetBoard();
    this.squares.forEach((square => {
      square.enabled = true;
      square.value = ''
    }));
    this.isGameWon = false;
    this.isGameDraw = false;
    this.currentPlayer = this.movementsService.nextPlayer(this.currentPlayer);
    if (this.playComputer && this.currentPlayer === 'o') {
      this.computerMove();
      console.log('hit')
    }
  }
  private playerMove(position: number): void {
    this.movementsService.addMove({position: position, player: this.currentPlayer});
    this.setSquareValue(position);
  }
  private computerMove(): void {
    const move = this.computerService.findNextMove(this.squares);
    this.movementsService.addMove({position: move.position, player: this.currentPlayer});
    this.setSquareValue(move.position);
    this.checkBoardForEnd();
  }
  private checkBoardForEnd(): void {
    this.isGameWon = this.movementsService.isGameWon(this.currentPlayer);
    this.isGameDraw = this.movementsService.isGameDraw() && !this.isGameWon;
    if (this.isGameWon) {
      this.disableAllSquares();
    } else {
      this.currentPlayer = this.movementsService.nextPlayer(this.currentPlayer);
      if (this.playComputer && this.currentPlayer === 'o') {
        // Call next move for the computer
        this.computerMove();
      }
    }
  }
  private getSquareByPosition(position: number): Square | undefined {
    return this.squares.find(square => square?.position === position);
  }
  private setSquareValue(position: number) {
    const square = this.getSquareByPosition(position);
    if(square != null) {
      square.value = this.currentPlayer;
      square.enabled = false;
    }
  }
  private disableAllSquares(): void {
    this.squares.forEach(square => square.enabled = false);
  }
}
