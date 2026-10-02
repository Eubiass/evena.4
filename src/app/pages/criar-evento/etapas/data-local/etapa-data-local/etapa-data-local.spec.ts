import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EtapaDataLocal } from "./etapa-data-local";

describe("EtapaDataLocal", () => {
  let component: EtapaDataLocal;
  let fixture: ComponentFixture<EtapaDataLocal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtapaDataLocal],
    }).compileComponents();

    fixture = TestBed.createComponent(EtapaDataLocal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
