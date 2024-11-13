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

  // Opposite corners
  oppositeCorners = [
    [0, 8],
    [2, 6]
  ];

  /**
   * If first move take a cornerIf second move, analyze first move. If corner - take center, If edge take corner
   * If third move, check if opposite corner or center was played.
   * Every move after, check for win, check for block, setup 2 win conditions or pick random
   * @param squares list of all squares
   * @returns a movement for the computer
   */
  getComputerMove(squares: Square[]): Movement {
    const remainingSquares = this.getRemainingSquares(squares);
    let nextMove = this.getRandomPosition(remainingSquares);
    switch(remainingSquares.length) {
      case 9:
        nextMove = this.firstMove(squares);
        break;
      case 8:
        nextMove = this.secondMove(squares);
        break;
      case 7:
        nextMove = this.thirdMove(squares);
        break
      case 6:
        nextMove = this.fourthMove(squares);
        break
      default:
        nextMove = this.nextBestMove(remainingSquares);
    }
    return nextMove;
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
    if (remainingCorners.length > 0) {
      const randomCorner = Math.floor((Math.random() * remainingCorners.length));
      return this.setMovement(remainingCorners[randomCorner].position);
    }
    return this.getRandomPosition(squares);
  }

  /**
   * Find available side move
   * @param squares list of all squares
   * @returns a random corner to start from
   */
  private getRandomSidePosition(squares: Square[]): Movement {
    const remainingSides = squares.filter(square => square.value === '' && this.sides.some(side => side === square.position));
    if (remainingSides.length > 0) {
      const randomSide = Math.floor((Math.random() * remainingSides.length));
      return this.setMovement(remainingSides[randomSide].position)
    }
    return this.getRandomPosition(squares);
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
    const currentPlayerSquares = this.getPlayerSquares(player, squares);
    const remainingSquares = this.getRemainingSquares(squares);
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
   * Filters movements
   * @param player to filter for
   * @param squares list of squares
   * @returns movements from the player
   */
  private getPlayerSquares(player: string, squares: Square[]): Square[] {
    return squares.filter(square => square.value === player);
  }

  /**
   * Filter the remaining squares available
   * @param squares list of all squares
   * @returns remaining squares to move
   */
  private getRemainingSquares(squares: Square[]): Square[] {
    return squares.filter(square => square.value === '');
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
   * Starting in the corner is the strongest win condition
   * @param squares list of squares
   * @returns first move of the game
   */
  private firstMove(squares: Square[]): Movement {
    return this.getRandomCornerPosition(squares);
  }

  /**
   * When the player starts, this will be the computers first move
   * @param squares list of squares
   * @returns second move of the game
   */
  private secondMove(squares: Square[]): Movement {
    const moveType = this.getUserStartingPosition(squares);
    if (moveType === 'corner' || moveType === 'edge') {
      return this.setMovement(this.center);
    }
    return this.getRandomCornerPosition(squares);
  }

  /**
   * This will be the computers second move when the player starts
   * @param squares list of all squares
   * @returns third move of the game
   */
  private thirdMove(squares: Square[]): Movement {
    const playerSquares = this.getPlayerSquares('x', squares);
    const computerSquares = this.getPlayerSquares('o', squares);
    const moveType = this.getUserStartingPosition(squares);
    // Check if player played the opposite corner
    let oppositeCorner = false;
    this.oppositeCorners.forEach(opposite => {
      const matchOppositeCorners = [...playerSquares, ...computerSquares].filter(square => square.position === opposite[0] || square.position === opposite[1]);
      if (matchOppositeCorners.length === 2) {
        oppositeCorner = true;
      }
    });
    // If not opposite corner and center is open, take center
    if (!oppositeCorner && (moveType === 'corner' || moveType === 'edge')) {
      return this.setMovement(this.center);
    }
    // If opposite corner was played, take next random corner
    return this.getRandomCornerPosition(squares);
  }

  /**
   * Block opponent winning move or pick a side square
   * @param squares list of squares
   * @returns block win or side move
   */
  private fourthMove(squares: Square[]): Movement {
    let nextMove = this.getRandomSidePosition(squares);
    const blockOpponentWinningMove = this.getWinMovement(squares, 'x');
    if (blockOpponentWinningMove) {
      nextMove = blockOpponentWinningMove;
    }
    return nextMove;
  }

  /**
   * Checks for win move, then check for block move
   * Prioritizes corner over side movement to setup a fork to win
   * @param squares list of remaining squares
   * @returns next best move
   */
  private nextBestMove(squares: Square[]): Movement {
      const remainingCorners = squares.filter(square => square.value === '' && this.corners.some(corner => corner === square.position));
      let nextMove = this.getRandomPosition(squares)
      // Check for win move
      const winningMove = this.getWinMovement(squares, 'o');
      // Check for block move
      const blockOpponentWinningMove = this.getWinMovement(squares, 'x');
      if (winningMove) {
        nextMove = winningMove;
      } else if (blockOpponentWinningMove) {
        nextMove = blockOpponentWinningMove;
      } else if (remainingCorners) {
        nextMove = this.getRandomCornerPosition(squares);
      }
    return nextMove;
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
