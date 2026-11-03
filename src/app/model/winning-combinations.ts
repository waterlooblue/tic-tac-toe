/**
 * Grid values
 * 0 | 1 | 2
 * 3 | 4 | 5
 * 6 | 7 | 8
 *
 * There are 8 combinations that equal a win (3 squares in a row)
 */
export const WINNING_COMBINATIONS: readonly (readonly number[])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
