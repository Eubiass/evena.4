import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BuscaEventos } from "./busca-eventos";

describe("BuscaEventos", () => {
  let component: BuscaEventos;
  let fixture: ComponentFixture<BuscaEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaEventos],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscaEventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
