import { Injectable } from '@angular/core';
import { Square } from '../../model/square';
import { Movement } from '../../model/movement';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  constructor() { }
  findNextMove(squares: Square[]): Movement {
    const remainingSpaces = squares.filter(square => square.value === '');
    const firstAvailablePosition = { position: remainingSpaces[0].position, player: 'o'}
    return firstAvailablePosition;
  }
}
