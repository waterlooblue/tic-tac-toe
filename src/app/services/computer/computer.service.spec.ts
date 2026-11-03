import { TestBed } from '@angular/core/testing';
import { ComputerService } from './computer.service';
import { Square } from '../../model/square';
import { WINNING_COMBINATIONS } from '../../model/winning-combinations';

/**
 * Builds a board from a 9 character string, e.g. 'x-o------' ('-' is empty)
 */
function board(layout: string): Square[] {
  return layout.split('').map((char, position) => ({
    position,
    value: char === '-' ? '' : char,
    enabled: char === '-',
    win: false
  }));
}

function winner(squares: Square[]): string {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const value = squares[a].value;
    if (value !== '' && value === squares[b].value && value === squares[c].value) {
      return value;
    }
  }
  return '';
}

describe('ComputerService', () => {
  let service: ComputerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should always return a movement for player o', () => {
    expect(service.getComputerMove(board('x--------')).player).toBe('o');
  });

  it('should open in a corner when the computer starts', () => {
    for (let i = 0; i < 20; i++) {
      expect([0, 2, 6, 8]).toContain(service.getComputerMove(board('---------')).position);
    }
  });

  it('should take the center when the player opens in a corner or edge', () => {
    expect(service.getComputerMove(board('x--------')).position).toBe(4);
    expect(service.getComputerMove(board('-x-------')).position).toBe(4);
  });

  it('should take a corner when the player opens in the center', () => {
    expect([0, 2, 6, 8]).toContain(service.getComputerMove(board('----x----')).position);
  });

  it('should take a winning move on square 0', () => {
    // o wins on 0 (0, 3, 6); x also threatens on 2 (2, 5, 8)
    expect(service.getComputerMove(board('-x-o-xo-x')).position).toBe(0);
  });

  it('should block the opponent on square 0', () => {
    // x threatens 0 via 1, 2
    expect(service.getComputerMove(board('-xx-o----')).position).toBe(0);
  });

  it('should prefer winning over blocking', () => {
    // o wins on 5 (3, 4, 5); x threatens on 2 (0, 1, 2)
    expect(service.getComputerMove(board('xx-oo-x--')).position).toBe(5);
  });

  /**
   * Plays every possible sequence of player moves against the computer and
   * verifies the computer never picks an occupied square and never loses.
   */
  function playAllGames(squares: Square[], turn: string, losses: string[], history: number[]): void {
    const result = winner(squares);
    const empty = squares.filter(s => s.value === '');
    if (result === 'x') {
      losses.push(history.join(','));
      return;
    }
    if (result === 'o' || empty.length === 0) {
      return;
    }
    if (turn === 'o') {
      const move = service.getComputerMove(squares);
      expect(squares[move.position].value).withContext(`occupied after ${history}`).toBe('');
      const next = squares.map(s => s.position === move.position ? { ...s, value: 'o', enabled: false } : s);
      playAllGames(next, 'x', losses, [...history, move.position]);
    } else {
      empty.forEach(square => {
        const next = squares.map(s => s.position === square.position ? { ...s, value: 'x', enabled: false } : s);
        playAllGames(next, 'o', losses, [...history, square.position]);
      });
    }
  }

  it('should never lose when the player starts', () => {
    const losses: string[] = [];
    // Repeat to cover the computer's random choices
    for (let run = 0; run < 25; run++) {
      playAllGames(board('---------'), 'x', losses, []);
    }
    expect(losses).withContext(`losing sequences: ${[...new Set(losses)].slice(0, 5)}`).toEqual([]);
  });

  it('should never lose when the computer starts', () => {
    const losses: string[] = [];
    for (let run = 0; run < 25; run++) {
      playAllGames(board('---------'), 'o', losses, []);
    }
    expect(losses).withContext(`losing sequences: ${[...new Set(losses)].slice(0, 5)}`).toEqual([]);
  });
});
