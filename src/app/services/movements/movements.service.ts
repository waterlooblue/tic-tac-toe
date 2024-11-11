import { Injectable } from '@angular/core';
import { Movement } from '../../model/movement';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {
  constructor() { }
  
  // Tracks all movements
  movements: Movement[] = [];
  
  // There are 8 combinations that equal a win (3 squares in a row)
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

  /**
   * Adds a move to the movements array
   * @param move movement to be added to the list
   */
  addMove(move: Movement): void {
    this.movements.push({
      position: move.position,
      player: move.player
    });
  }
  
  /**
   * Toggles between X and O
   * @param player the current player
   * @returns the next player
   */
  nextPlayer(player: string): string {
    return player === 'x' ? 'o' : 'x';
  }

  /**
   * Removes all existing moves
   */
  resetBoard(): void {
    this.movements = [];
  }

  /**
   * Max possible moves is 9. If movements equals 9 then there are no more moves available
   * @returns if the game is a draw
   */
  isGameDraw(): boolean {
    return this.movements.length === 9;
  }
  
  /**
   * Determines if movements match a winning combination
   * @param currentPlayer the current player
   * @returns if the game has been won
   */
  isGameWon(currentPlayer: string): boolean {
    // Filters movements to the current player
    const currentPlayerMovements = this.movements.filter(move => move.player === currentPlayer);
    let gameIsWon = false;
    this.winningCombinations.forEach(combo => {
      // Filters movements to see if they match a winning combintaion
      const matchingMovements = currentPlayerMovements.filter(move => move.position === combo[0] || move.position === combo[1] || move.position === combo[2]);
      if (matchingMovements.length === 3) {
        gameIsWon = true;
      }
    });
    return gameIsWon;
  }
}
