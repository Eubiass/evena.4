import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SelecaoDiasBloco } from "./selecao-dias-bloco";

describe("SelecaoDiasBloco", () => {
  let component: SelecaoDiasBloco;
  let fixture: ComponentFixture<SelecaoDiasBloco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecaoDiasBloco],
    }).compileComponents();

    fixture = TestBed.createComponent(SelecaoDiasBloco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
