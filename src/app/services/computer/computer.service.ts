import { Injectable } from '@angular/core';
import { Square } from '../../model/square';
import { Movement } from '../../model/movement';
import { MovementsService } from '../movements/movements.service';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  constructor(private movementsService: MovementsService) { }

  /**
   * Grid values
   * 0 | 1 | 2
   * 3 | 4 | 5
   * 6 | 7 | 8 
   */

  // Grid
  corners = [0,2,6,8];
  sides = [1,3,5,7];
  center = 4;

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
   * Determines the best move for the computer
   * @param squares list of all squares
   * @returns a movement for the computer
   */
  getComputerMove(squares: Square[]): Movement {
    const remainingSquares = this.getAvailableSquares(squares);
    let nextMove = this.getRandomPosition(remainingSquares);
    // If making the first move
    if (remainingSquares.length === 9) {
      nextMove = this.getRandomCornerPosition(squares);
    } else if (remainingSquares.length === 8) {
      // If making the second move
      const moveType = this.getUserStartingPosition(squares);
      switch(moveType) {
        case 'corner':
        case 'edge':
          nextMove = this.setMovement(this.center);
          break;
        default:
          // Take a corner if the user played the center
          nextMove = this.getRandomCornerPosition(squares);
      }
    } else if (remainingSquares.length === 7 && !this.isCenterPositionAvailable(squares)) {
        nextMove = this.getRandomCornerPosition(squares);
    } else {
      // Check for win 2 matches in win condition with the 3rd being available
      const winningMove = this.getWinMovement(squares, 'o');
      // Check for block, opponent has 2 matches with a 3rd being available
      const blockWinningMove = this.getWinMovement(squares, 'x');
      if (winningMove) {
        nextMove = winningMove;
      } else if (blockWinningMove) {
        nextMove = blockWinningMove;
      } else {
        const playerCorners = this.getPlayerCorners(squares);
        if (playerCorners.length === 2) {
          nextMove = this.getRandomSidePosition(squares);
        }
      }
    }
    // If first move take a corner
    // If second move, analyze first move. If corner - take center, If edge take corner
    // Every move after, check for win, check for block, setup 2 win conditions or pick random
    return nextMove;
  }

  /**
   * Finds the first available square
   * @param squares list of all squares
   * @returns the remaining squares to play
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
   * Find available corner move
   * @param squares list of all squares
   * @returns a random corner to start from
   */
  private getRandomCornerPosition(squares: Square[]): Movement {
    const remainingCorners = squares.filter(square => square.value === '' && this.corners.some(corner => corner === square.position));
    const randomCorner = Math.floor((Math.random() * remainingCorners.length))
    return this.setMovement(remainingCorners[randomCorner].position);
  }

  /**
   * Find available side move
   * @param squares list of all squares
   * @returns a random corner to start from
   */
  private getRandomSidePosition(squares: Square[]): Movement {
    const remainingSides = squares.filter(square => square.value === '' && this.sides.some(side => side === square.position));
    const randomCorner = Math.floor((Math.random() * remainingSides.length))
    return this.setMovement(remainingSides[randomCorner].position);
  }

  /**
   * Determines if the center is available
   * @param squares remaining squares
   * @returns boolean if the center is available
   */
  private isCenterPositionAvailable(squares: Square[]): boolean {
    return squares.some(square => square.position === this.center);
  }

  /**
   * Determine what type of move the user made
   * @param squares list of all squares
   * @returns type of stating position by the user
   */
  private getUserStartingPosition(squares: Square[]): string {
    let positionType = '';
    const startingPosition = squares.find(square => square.value === 'x');
    switch(startingPosition?.position) {
      case 0:
      case 2:
      case 6:
      case 8:
        positionType = 'corner';
        break;
      case 1:
      case 3:
      case 5:
      case 7:
        positionType = 'edge';
        break;
      default:
        positionType = 'center';
    }
    return positionType;
  }

  /**
   * Makes a winning move or blocks a winning move if its available
   * @param squares list of all squares
   * @param player to check for win condition
   * @returns winning/block move or null if not available
   */
  private getWinMovement(squares: Square[], player: string): Movement | null {
    const currentPlayerSquares = squares.filter(square => square.value === player);
    const remainingSquares = squares.filter(square => square.value === '');
    let nextMove = null;
    this.winningCombinations.forEach(combo => {
      // Filters movements to see if they match a winning combintaion
      const matchingMovements = this.compareWinningSquares(currentPlayerSquares, combo)
      if (matchingMovements.length === 2) {
        // Check if the 3rd square is available
        const winningPosition = combo.find(position => position !== matchingMovements[0].position && position !== matchingMovements[1].position);
        const nextSquareAvailable = remainingSquares.find(square => square.position === winningPosition && square.value === '');
        if (winningPosition && nextSquareAvailable) {
          nextMove = this.setMovement(winningPosition);
        }
      }
    });
    return nextMove;
  }

  /**
   * Determine if the player has two corners
   * @param squares list of all squares
   * @returns list of corners taken by the player
   */
  private getPlayerCorners(squares: Square[]): Square[] {
    return squares.filter(square => square.value === 'x' && this.corners.some(corner => corner === square.position))
  }

  /**
   * Filters movements
   * @param player to filter for
   * @param squares list of squares
   * @returns movements from the player
   */
  private getPlayerSquares(player: string, squares: Square[]): Square[] {
    return squares.filter(square => square.value === player);
  }

  /**
   * Determines possible winning moves or if win exist
   * @param playerSquares list of player squares
   * @param combo winning combination
   * @returns matching movements to winning combinations
   */
  private compareWinningSquares(playerSquares: Square[], combo: number[]): Square[] {
    return playerSquares.filter(square => square.position === combo[0] || square.position === combo[1] || square.position === combo[2]);
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
