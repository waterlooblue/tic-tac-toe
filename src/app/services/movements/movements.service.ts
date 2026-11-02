import { Injectable } from '@angular/core';
import { Movement } from '../../model/movement';
import { WINNING_COMBINATIONS } from '../../model/winning-combinations';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {
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
    for (const combo of WINNING_COMBINATIONS) {
      const matchingMovements = currentPlayerMovements.filter(move => combo.includes(move.position));
      if (matchingMovements.length === 3) {
        return matchingMovements;
      }
    }
    return [];
  }

  /**
   * Filters movements
   * @param player to filter for
   * @returns movements from the player
   */
  private getPlayerMovements(player: string): Movement[] {
    return this.movements.filter(move => move.player === player);
  }
}
