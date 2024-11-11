import { Injectable } from '@angular/core';
import { Square } from '../../model/square';
import { Movement } from '../../model/movement';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  constructor() { }

  /**
   * Grid values
   * 0 | 1 | 2
   * 3 | 4 | 5
   * 6 | 7 | 8 
   */
  
  /**
   * Determines the best move for the computer
   * @param squares list of all squares
   * @returns a movement for the computer
   */
  getComputerMove(squares: Square[]): Movement {
    const remainingSquares = this.getAvailableSquares(squares);
    if (remainingSquares.length === 9) {
      console.log('First move');
      return this.getRandomCornerPosition();
    } else {
      if (this.isCenterPositionAvailable(remainingSquares)) {
        return this.setMovement(4);
      }
    }
    return this.getFirstAvailablePosition(remainingSquares);
  }

  /**
   * Finds the first available square
   * @param squares list of all squares
   * @returns 
   */
  private getAvailableSquares(squares: Square[]): Square[] {
    const remainingSpaces = squares.filter(square => square.value === '');
    return remainingSpaces;
  }

  /**
   * Easy mode for computer that plays first available move
   * @param squares list of available squares
   * @returns first available square
   */
  private getFirstAvailablePosition(squares: Square[]): Movement {
    return this.setMovement(squares[0].position);
  }

  /**
   * If making the first move. Determines corner to start from
   * @returns a random corner to start from
   */
  private getRandomCornerPosition(): Movement {
    const corners = [0,2,6,8]
    const randomCorner = Math.floor((Math.random() * corners.length) + 1)
    return this.setMovement(corners[randomCorner]);
  }

  /**
   * Determines if the center is available
   * @param squares remaining squares
   * @returns boolean if the center is available
   */
  private isCenterPositionAvailable(squares: Square[]): boolean {
    return squares.some(square => square.position === 4);
  }

  /**
   * Sets the position in a movement object
   * @param position to be set for movement
   * @returns movement object
   */
  private setMovement(position: number): Movement {
    return { position: position, player: 'o' }
  }
}
