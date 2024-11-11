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
    // Checks if this is the first move
    if (remainingSquares.length === 9) {
      return this.getRandomCornerPosition();
    } else if (this.isCenterPositionAvailable(remainingSquares)) {
      return this.setMovement(4);
    }
    return this.getRandomPosition(remainingSquares);
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
   * Easy mode for computer that plays random available move
   * @param squares list of available squares
   * @returns random available square
   */
  private getRandomPosition(squares: Square[]): Movement {
    const randomPosition = Math.floor((Math.random() * squares.length));
    return this.setMovement(squares[randomPosition].position);
  }

  /**
   * If making the first move. Determines corner to start from
   * @returns a random corner to start from
   */
  private getRandomCornerPosition(): Movement {
    const corners = [0,2,6,8]
    const randomCorner = Math.floor((Math.random() * corners.length))
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
