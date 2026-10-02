import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BarraEtapas } from "./barra-etapas";

describe("BarraEtapas", () => {
  let component: BarraEtapas;
  let fixture: ComponentFixture<BarraEtapas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraEtapas],
    }).compileComponents();

    fixture = TestBed.createComponent(BarraEtapas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
