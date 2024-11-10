import { Injectable } from '@angular/core';
import { Square } from '../../model/square';
import { Movement } from '../../model/movement';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  constructor() { }
  findNextMove(squares: Square[]): Movement {
    let remainingSpaces = squares.filter(square => square.value === '');
    return { position: remainingSpaces[0].position, player: 'o'};
  }
}
