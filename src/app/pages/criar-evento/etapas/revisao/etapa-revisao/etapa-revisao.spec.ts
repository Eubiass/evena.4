import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EtapaRevisao } from "./etapa-revisao";

describe("EtapaRevisao", () => {
  let component: EtapaRevisao;
  let fixture: ComponentFixture<EtapaRevisao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtapaRevisao],
    }).compileComponents();

    fixture = TestBed.createComponent(EtapaRevisao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
