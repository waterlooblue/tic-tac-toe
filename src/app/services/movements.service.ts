import { Injectable } from '@angular/core';
import { Movement } from '../model/movement';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {
  constructor() { }
  movements: Movement[] = [];
  currentPlayer = 'x';
  gameIsWon = false;
  winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  addMove(square: number): void {
    this.movements.push({
      player: this.currentPlayer,
      square: square
    });
    if (this.isGameWon()) {
      // Do something for the winner
      console.log(`Player ${this.currentPlayer} is the winner`)
    } else if (this.isGameDraw()) {
      // Do something for a draw
      console.log('Game is a draw')
    }
  }
  nextPlayer(): string {
    return this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
  }
  resetBoard(): void {
    this.movements = [];
  }
  private isGameDraw(): boolean {
    return this.movements.length === 9 && !this.gameIsWon;
  }
  private isGameWon(): boolean {
    const currentPlayerMovements = this.movements.filter(move => move.player === this.currentPlayer);;
    this.winningCombinations.forEach(combo => {
      const matchingMovements = currentPlayerMovements.filter(move => move.square === combo[0] || move.square === combo[1] || move.square === combo[2]);
      if (matchingMovements.length === 3) {
        console.log('Player has won')
        this.gameIsWon = true;
      }
    });
    return this.gameIsWon;
  }
  private endGame(): void {
    // Add functions to end the game
  }
}
