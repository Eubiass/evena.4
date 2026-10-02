import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EtapaInformacoes } from "./etapa-informacoes";

describe("EtapaInformacoes", () => {
  let component: EtapaInformacoes;
  let fixture: ComponentFixture<EtapaInformacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtapaInformacoes],
    }).compileComponents();

    fixture = TestBed.createComponent(EtapaInformacoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
