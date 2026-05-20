import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosPerto } from './eventos-perto';

describe('EventosPerto', () => {
  let component: EventosPerto;
  let fixture: ComponentFixture<EventosPerto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosPerto],
    }).compileComponents();

    fixture = TestBed.createComponent(EventosPerto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
