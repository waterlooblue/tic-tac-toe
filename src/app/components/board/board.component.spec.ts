import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BoardComponent } from './board.component';
import { MovementsService } from '../../services/movements/movements.service';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  function click(...positions: number[]): void {
    positions.forEach(position => component.receiveClick(position));
    fixture.detectChanges();
  }

  function values(): string[] {
    return component.squares.map(square => square.value);
  }

  function statusText(): string {
    return (fixture.nativeElement as HTMLElement).querySelector('.turn')?.textContent?.trim() ?? '';
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardComponent]
    })
    .compileComponents();

    TestBed.inject(MovementsService).resetBoard();
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 9 squares and start with X', () => {
    const squares = (fixture.nativeElement as HTMLElement).querySelectorAll('app-square');
    expect(squares.length).toBe(9);
    expect(statusText()).toBe('X turn');
  });

  it('should alternate players and disable played squares', () => {
    click(0, 4);
    expect(values()).toEqual(['x', '', '', '', 'o', '', '', '', '']);
    expect(component.squares[0].enabled).toBeFalse();
    expect(component.squares[4].enabled).toBeFalse();
    expect(component.currentPlayer).toBe('x');
  });

  it('should detect a win, highlight squares and update the score', () => {
    click(0, 3, 1, 4, 2);
    expect(component.isGameWon).toBeTrue();
    expect(component.playerOneWins).toBe(1);
    expect(component.squares.filter(s => s.win).map(s => s.position)).toEqual([0, 1, 2]);
    expect(component.squares.every(s => !s.enabled)).toBeTrue();
    expect(statusText()).toBe('X wins');
  });

  it('should count player two wins', () => {
    click(0, 3, 1, 4, 8, 5);
    expect(component.isGameWon).toBeTrue();
    expect(component.playerTwoWins).toBe(1);
    expect(statusText()).toBe('O wins');
  });

  it('should detect a draw', () => {
    click(0, 1, 2, 4, 3, 5, 7, 6, 8);
    expect(component.isGameWon).toBeFalse();
    expect(component.isGameDraw).toBeTrue();
    expect(component.draws).toBe(1);
    expect(statusText()).toBe('Draw');
  });

  it('should not report a draw when the last move wins', () => {
    // x wins on the 9th move with 0, 4, 8
    click(0, 1, 2, 5, 3, 6, 4, 7, 8);
    expect(component.isGameWon).toBeTrue();
    expect(component.isGameDraw).toBeFalse();
    expect(component.draws).toBe(0);
  });

  it('should reset the board and alternate the starting player', () => {
    click(0, 3, 1, 4, 2);
    component.reset();
    fixture.detectChanges();
    expect(values().every(v => v === '')).toBeTrue();
    expect(component.squares.every(s => s.enabled && !s.win)).toBeTrue();
    expect(component.isGameWon).toBeFalse();
    expect(component.currentPlayer).toBe('o');
    expect(component.playerOneWins).toBe(1);
  });

  it('should play the computer move after the player', fakeAsync(() => {
    component.togglePlayers();
    // Toggling resets the board which alternates the starting player to o (computer)
    tick(BoardComponent.COMPUTER_DELAY_MS);
    expect(values().filter(v => v === 'o').length).toBe(1);
    expect(component.currentPlayer).toBe('x');

    const empty = component.squares.find(s => s.value === '')!;
    click(empty.position);
    expect(component.currentPlayer).toBe('o');
    tick(BoardComponent.COMPUTER_DELAY_MS);
    expect(values().filter(v => v === 'o').length).toBe(2);
    expect(values().filter(v => v === 'x').length).toBe(1);
  }));

  it('should ignore player clicks during the computer turn', fakeAsync(() => {
    component.togglePlayers();
    expect(component.currentPlayer).toBe('o');
    click(0);
    expect(values()[0]).toBe('');
    tick(BoardComponent.COMPUTER_DELAY_MS);
  }));

  it('should cancel a pending computer move when toggling back to two players', fakeAsync(() => {
    component.togglePlayers();
    component.togglePlayers();
    tick(BoardComponent.COMPUTER_DELAY_MS);
    expect(component.playComputer).toBeFalse();
    expect(values().every(v => v === '')).toBeTrue();
  }));

  it('should reset the score when toggling players', () => {
    click(0, 3, 1, 4, 2);
    component.togglePlayers();
    expect(component.playerOneWins).toBe(0);
    expect(component.playerTwoWins).toBe(0);
    expect(component.draws).toBe(0);
  });
});
