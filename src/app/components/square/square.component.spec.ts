import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareComponent } from './square.component';

describe('SquareComponent', () => {
  let component: SquareComponent;
  let fixture: ComponentFixture<SquareComponent>;

  function button(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SquareComponent);
    component = fixture.componentInstance;
    component.props = { position: 3, value: '', enabled: true, win: false };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit its position when clicked', () => {
    const emitted: number[] = [];
    component.clickEvent.subscribe((position: number) => emitted.push(position));
    button().click();
    expect(emitted).toEqual([3]);
  });

  it('should be disabled and show the value once played', () => {
    component.props = { position: 3, value: 'x', enabled: false, win: false };
    fixture.detectChanges();
    expect(button().disabled).toBeTrue();
    expect(button().textContent?.trim()).toBe('x');
    expect(button().classList).toContain('text-x');
  });

  it('should apply the win class', () => {
    component.props = { position: 3, value: 'o', enabled: false, win: true };
    fixture.detectChanges();
    expect(button().classList).toContain('win');
    expect(button().classList).toContain('text-o');
  });
});
