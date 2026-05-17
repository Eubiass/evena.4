import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ComodidadesBloco } from "./comodidades-bloco";

describe("ComodidadesBloco", () => {
  let component: ComodidadesBloco;
  let fixture: ComponentFixture<ComodidadesBloco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComodidadesBloco],
    }).compileComponents();

    fixture = TestBed.createComponent(ComodidadesBloco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
