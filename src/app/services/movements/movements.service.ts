import { Injectable } from '@angular/core';
import { Movement } from '../../model/movement';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {
  constructor() { }

  /**
   * Grid values
   * 0 | 1 | 2
   * 3 | 4 | 5
   * 6 | 7 | 8 
   */
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

   // Tracks all movements
  movements: Movement[] = [];

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
  getWinningMovements(currentPlayer: string): Movement[] {
    const currentPlayerMovements = this.getPlayerMovements(currentPlayer);
    let gameIsWon: Movement[] = [];
    this.winningCombinations.forEach(combo => {
      const matchingMovements = this.compareWinningMovements(currentPlayerMovements, combo);
      if (matchingMovements.length === 3) {
        gameIsWon = matchingMovements;
      }
    });
    return gameIsWon;
  }

  /**
   * Filters movements
   * @param player to filter for
   * @returns movements from the player
   */
  private getPlayerMovements(player: string): Movement[] {
    return this.movements.filter(move => move.player === player);
  }

  /**
   * Determines possible winning moves or if win exist
   * @param playerMovements list of player movements
   * @param combo winning combination
   * @returns matching movements to winning combinations
   */
  private compareWinningMovements(playerMovements: Movement[], combo: number[]): Movement[] {
    return playerMovements.filter(move => move.position === combo[0] || move.position === combo[1] || move.position === combo[2]);
  }
}
