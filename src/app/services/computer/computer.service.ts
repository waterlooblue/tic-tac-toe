import { Injectable } from '@angular/core';
import { Square } from '../../model/square';
import { Movement } from '../../model/movement';
import { WINNING_COMBINATIONS } from '../../model/winning-combinations';

const COMPUTER = 'o';
const PLAYER = 'x';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  /**
   * Grid values
   * 0 | 1 | 2
   * 3 | 4 | 5
   * 6 | 7 | 8
   */
  readonly corners = [0, 2, 6, 8];
  readonly center = 4;

  // Opposite corners
  readonly oppositeCorners = [
    [0, 8],
    [2, 6]
  ];

  /**
   * Opening moves use a simple playbook:
   * - First move: take a corner
   * - Second move: if the player took a corner or edge, take the center, otherwise a corner
   * - Third move: take the center unless the player took the opposite corner or the center
   * Every move after: win if possible, block if needed, otherwise pick a random move
   * that cannot lose (avoids forks)
   * @param squares list of all squares
   * @returns a movement for the computer
   */
  getComputerMove(squares: Square[]): Movement {
    const board = squares.map(square => square.value);
    switch (this.getRemainingPositions(board).length) {
      case 9:
        return this.firstMove(board);
      case 8:
        return this.secondMove(board);
      case 7:
        return this.thirdMove(board);
      default:
        return this.nextBestMove(board);
    }
  }

  /**
   * Picks a random element of a list
   * @param positions list of positions
   * @returns random position
   */
  private getRandom(positions: number[]): number {
    return positions[Math.floor(Math.random() * positions.length)];
  }

  /**
   * Find available corner move, falls back to any available square
   * @param board values of all squares
   * @returns a random available corner
   */
  private getRandomCornerPosition(board: string[]): Movement {
    const remainingCorners = this.corners.filter(corner => board[corner] === '');
    const options = remainingCorners.length > 0 ? remainingCorners : this.getRemainingPositions(board);
    return this.setMovement(this.getRandom(options));
  }

  /**
   * Positions that have not been played
   * @param board values of all squares
   * @returns remaining positions
   */
  private getRemainingPositions(board: string[]): number[] {
    return board.reduce<number[]>((positions, value, position) => {
      if (value === '') {
        positions.push(position);
      }
      return positions;
    }, []);
  }

  /**
   * Finds a square that completes three in a row for the player
   * @param board values of all squares
   * @param player to check for win condition
   * @returns winning position or null if not available
   */
  private getWinPosition(board: string[], player: string): number | null {
    for (const combo of WINNING_COMBINATIONS) {
      const values = combo.map(position => board[position]);
      if (values.filter(value => value === player).length === 2 && values.includes('')) {
        return combo[values.indexOf('')];
      }
    }
    return null;
  }

  /**
   * Determines the winner of the board
   * @param board values of all squares
   * @returns the winning player or '' if no winner
   */
  private getWinner(board: string[]): string {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return '';
  }

  /**
   * Minimax score of the board, positive is good for the computer.
   * Faster wins and slower losses score higher.
   * @param board values of all squares
   * @param player whose turn it is
   * @param depth number of moves played in the search
   * @returns score of the board
   */
  private minimax(board: string[], player: string, depth: number): number {
    const winner = this.getWinner(board);
    if (winner === COMPUTER) {
      return 10 - depth;
    }
    if (winner === PLAYER) {
      return depth - 10;
    }
    const remaining = this.getRemainingPositions(board);
    if (remaining.length === 0) {
      return 0;
    }
    let best = player === COMPUTER ? -Infinity : Infinity;
    for (const position of remaining) {
      board[position] = player;
      const score = this.minimax(board, player === COMPUTER ? PLAYER : COMPUTER, depth + 1);
      board[position] = '';
      best = player === COMPUTER ? Math.max(best, score) : Math.min(best, score);
    }
    return best;
  }

  /**
   * Starting in the corner is the strongest win condition
   * @param board values of all squares
   * @returns first move of the game
   */
  private firstMove(board: string[]): Movement {
    return this.getRandomCornerPosition(board);
  }

  /**
   * When the player starts, this will be the computers first move
   * @param board values of all squares
   * @returns second move of the game
   */
  private secondMove(board: string[]): Movement {
    if (board[this.center] === '') {
      return this.setMovement(this.center);
    }
    return this.getRandomCornerPosition(board);
  }

  /**
   * This will be the computers second move when the computer starts
   * @param board values of all squares
   * @returns third move of the game
   */
  private thirdMove(board: string[]): Movement {
    // Check if the player played the corner opposite the computer
    const oppositeCorner = this.oppositeCorners.some(([a, b]) =>
      (board[a] === PLAYER && board[b] === COMPUTER) || (board[a] === COMPUTER && board[b] === PLAYER));
    if (!oppositeCorner && board[this.center] === '') {
      return this.setMovement(this.center);
    }
    return this.getRandomCornerPosition(board);
  }

  /**
   * Win if possible, block if needed, otherwise a random move with the best minimax score
   * @param board values of all squares
   * @returns next best move
   */
  private nextBestMove(board: string[]): Movement {
    const winPosition = this.getWinPosition(board, COMPUTER) ?? this.getWinPosition(board, PLAYER);
    if (winPosition !== null) {
      return this.setMovement(winPosition);
    }
    let bestScore = -Infinity;
    let bestPositions: number[] = [];
    for (const position of this.getRemainingPositions(board)) {
      board[position] = COMPUTER;
      const score = this.minimax(board, PLAYER, 1);
      board[position] = '';
      if (score > bestScore) {
        bestScore = score;
        bestPositions = [position];
      } else if (score === bestScore) {
        bestPositions.push(position);
      }
    }
    return this.setMovement(this.getRandom(bestPositions));
  }

  /**
   * Sets the position in a movement object
   * @param position to be set for movement
   * @returns movement object
   */
  private setMovement(position: number): Movement {
    return { position: position, player: COMPUTER };
  }
}
