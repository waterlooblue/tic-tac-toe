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
  playerOneWins = 0;
  playerTwoWins = 0;
  computerWins = 0;
  draws = 0;
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
  
  /**
   * Adds the player movement and check for win or draw
   * @param $event the number of the square
   */
  receiveClick ($event: number) {
    // Prevents player clicking cells when its the computers turn
    if (!this.playComputer || (this.playComputer && this.currentPlayer === 'x')) {
      this.playerMove($event);  
      this.checkBoardForEnd();
    }
  }

  /**
   * Toggle for playing the computer
   */
  togglePlayers(): void {
    this.playComputer = !this.playComputer;
    this.playerOneWins = 0;
    this.playerTwoWins = 0;
    this.computerWins = 0;
    this.draws = 0;
    this.reset();
  }

  /**
   * Resets the board state
   */
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
      setTimeout(() => this.computerMove(), 300);
    }
  }

  /**
   * Sets the player movement on the board
   * @param position of the square
   */
  private playerMove(position: number): void {
    this.movementsService.addMove({position: position, player: this.currentPlayer});
    this.setSquareValue(position);
  }

  /**
   * Calls the computer service to determine a move
   */
  private computerMove(): void {
    const move = this.computerService.getComputerMove(this.squares);
    this.movementsService.addMove({position: move.position, player: this.currentPlayer});
    this.setSquareValue(move.position);
    this.checkBoardForEnd();
  }

  /**
   * Check for win or draw
   * Switches to next player if the game continues
   */
  private checkBoardForEnd(): void {
    this.isGameWon = this.movementsService.isGameWon(this.currentPlayer);
    this.isGameDraw = this.movementsService.isGameDraw() && !this.isGameWon;
    if (this.isGameWon) {
      if (this.currentPlayer === 'x') {
        this.playerOneWins += 1;
      } else if (this.playComputer && this.currentPlayer === 'o') {
        this.computerWins += 1;
      } else {
        this.playerTwoWins += 1;
      }
      this.disableAllSquares(this.squares);
    } else if (!this.isGameDraw) {
      this.currentPlayer = this.movementsService.nextPlayer(this.currentPlayer);
      if (this.playComputer && this.currentPlayer === 'o') {
        // Call next move for the computer
        setTimeout(() => this.computerMove(), 300);
      }
    } else {
      this.draws += 1;
    }
  }

  /**
   * Gets the square object by position
   * @param position of the square
   * @returns square object
   */
  private getSquareByPosition(position: number): Square | undefined {
    return this.squares.find(square => square?.position === position);
  }

  /**
   * Sets the square value and disables the button
   * @param position of the square
   */
  private setSquareValue(position: number) {
    const square = this.getSquareByPosition(position);
    if(square != null) {
      square.value = this.currentPlayer;
      square.enabled = false;
    }
  }

  /**
   * Sets all buttons to be disabled
   * @param squares list of all squares
   */
  private disableAllSquares(squares: Square[]): void {
    squares.forEach(square => square.enabled = false);
  }
}
