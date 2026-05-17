import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InfoGeraisBloco } from "./info-gerais-bloco";

describe("InfoGeraisBloco", () => {
  let component: InfoGeraisBloco;
  let fixture: ComponentFixture<InfoGeraisBloco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoGeraisBloco],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoGeraisBloco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
