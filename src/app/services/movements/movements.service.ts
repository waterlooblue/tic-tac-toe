import { Injectable } from '@angular/core';
import { Movement } from '../../model/movement';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {
  constructor() { }
  movements: Movement[] = [];
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
  addMove(move: Movement): void {
    this.movements.push({
      position: move.position,
      player: move.player
    });
  }
  nextPlayer(player: string): string {
    return player === 'x' ? 'o' : 'x';
  }
  resetBoard(): void {
    this.movements = [];
  }
  isGameDraw(): boolean {
    return this.movements.length === 9;
  }
  isGameWon(currentPlayer: string): boolean {
    const currentPlayerMovements = this.movements.filter(move => move.player === currentPlayer);
    let gameIsWon = false;
    this.winningCombinations.forEach(combo => {
      const matchingMovements = currentPlayerMovements.filter(move => move.position === combo[0] || move.position === combo[1] || move.position === combo[2]);
      if (matchingMovements.length === 3) {
        gameIsWon = true;
      }
    });
    return gameIsWon;
  }
}
