import { TestBed } from '@angular/core/testing';
import { MovementsService } from './movements.service';

describe('MovementsService', () => {
  let service: MovementsService;

  function play(moves: [string, number][]): void {
    moves.forEach(([player, position]) => service.addMove({ player, position }));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovementsService);
    service.resetBoard();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle between players', () => {
    expect(service.nextPlayer('x')).toBe('o');
    expect(service.nextPlayer('o')).toBe('x');
  });

  it('should store a copy of the move', () => {
    const move = { player: 'x', position: 0 };
    service.addMove(move);
    move.position = 5;
    expect(service.movements).toEqual([{ player: 'x', position: 0 }]);
  });

  it('should clear moves on reset', () => {
    play([['x', 0], ['o', 1]]);
    service.resetBoard();
    expect(service.movements).toEqual([]);
  });

  it('should return no winning movements when there is no win', () => {
    play([['x', 0], ['o', 1], ['x', 2]]);
    expect(service.getWinningMovements('x')).toEqual([]);
  });

  it('should detect a row, column and diagonal win', () => {
    play([['x', 0], ['x', 1], ['x', 2]]);
    expect(service.getWinningMovements('x').map(m => m.position)).toEqual([0, 1, 2]);

    service.resetBoard();
    play([['o', 2], ['o', 5], ['o', 8]]);
    expect(service.getWinningMovements('o').map(m => m.position)).toEqual([2, 5, 8]);

    service.resetBoard();
    play([['x', 2], ['x', 4], ['x', 6]]);
    expect(service.getWinningMovements('x').map(m => m.position)).toEqual([2, 4, 6]);
  });

  it('should only return the three winning movements when the player has more moves', () => {
    play([['x', 0], ['x', 5], ['x', 4], ['x', 8]]);
    expect(service.getWinningMovements('x').map(m => m.position).sort()).toEqual([0, 4, 8]);
  });

  it('should not count the other player moves', () => {
    play([['x', 0], ['x', 1], ['o', 2]]);
    expect(service.getWinningMovements('x')).toEqual([]);
  });

  it('should be a draw after 9 moves', () => {
    play([['x', 0], ['o', 1], ['x', 2], ['o', 4], ['x', 3], ['o', 5], ['x', 7], ['o', 6]]);
    expect(service.isGameDraw()).toBeFalse();
    play([['x', 8]]);
    expect(service.isGameDraw()).toBeTrue();
  });
});
