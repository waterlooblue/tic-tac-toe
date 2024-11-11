import { Injectable } from '@angular/core';
import { Square } from '../../model/square';
import { Movement } from '../../model/movement';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  constructor() { }

  /**
   * Finds the first available square
   * @param squares list of all squares
   * @returns 
   */
  getAvailableSquares(squares: Square[]): Movement {
    const remainingSpaces = squares.filter(square => square.value === '');
    const firstAvailablePosition = this.getFirstAvailablePosition(remainingSpaces);
    return firstAvailablePosition;
  }

  /**
   * Determines if all squares are still enabled
   * @param squares list of all squares
   * @returns boolean if this is the first move
   */
  isFirstMove(squares: Square[]): boolean {
    let isFirstMove = true;
    squares.forEach(square => {
      if (!square.enabled) {
        isFirstMove = false;
      }
    });
    return isFirstMove;
  }

  /**
   * Easy mode for computer that plays first available move
   * @param squares list of available squares
   * @returns first available square
   */
  private getFirstAvailablePosition(squares: Square[]): Movement {
    return { position: squares[0].position, player: 'o'};
  }
}
