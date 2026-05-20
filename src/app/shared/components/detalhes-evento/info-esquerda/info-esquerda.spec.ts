import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InfoEsquerda } from "./info-esquerda";

describe("InfoEsquerda", () => {
  let component: InfoEsquerda;
  let fixture: ComponentFixture<InfoEsquerda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoEsquerda],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoEsquerda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
