import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HistoricoEventos } from "./historico-eventos";

describe("HistoricoEventos", () => {
  let component: HistoricoEventos;
  let fixture: ComponentFixture<HistoricoEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoEventos],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricoEventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
