import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SobreBloco } from "./sobre-bloco";

describe("SobreBloco", () => {
  let component: SobreBloco;
  let fixture: ComponentFixture<SobreBloco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreBloco],
    }).compileComponents();

    fixture = TestBed.createComponent(SobreBloco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
