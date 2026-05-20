import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LocalizacaoBloco } from "./localizacao-bloco";

describe("LocalizacaoBloco", () => {
  let component: LocalizacaoBloco;
  let fixture: ComponentFixture<LocalizacaoBloco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalizacaoBloco],
    }).compileComponents();

    fixture = TestBed.createComponent(LocalizacaoBloco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
