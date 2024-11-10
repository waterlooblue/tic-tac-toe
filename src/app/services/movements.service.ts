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
  addMove(position: number): void {
    this.movements.push({
      player: this.currentPlayer,
      position: position
    });
  }
  nextPlayer(): string {
    return this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
  }
  resetBoard(): void {
    this.movements = [];
    this.gameIsWon = false;
  }
  isGameDraw(): boolean {
    return this.movements.length === 9 && !this.gameIsWon;
  }
  isGameWon(): boolean {
    const currentPlayerMovements = this.movements.filter(move => move.player === this.currentPlayer);;
    this.winningCombinations.forEach(combo => {
      const matchingMovements = currentPlayerMovements.filter(move => move.position === combo[0] || move.position === combo[1] || move.position === combo[2]);
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
