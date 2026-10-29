import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EventosFavoritos } from "./eventos-favoritos";

describe("EventosFavoritos", () => {
  let component: EventosFavoritos;
  let fixture: ComponentFixture<EventosFavoritos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosFavoritos],
    }).compileComponents();

    fixture = TestBed.createComponent(EventosFavoritos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
