import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HeaderDetalhe } from "./header-detalhe";

describe("HeaderDetalhe", () => {
  let component: HeaderDetalhe;
  let fixture: ComponentFixture<HeaderDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderDetalhe],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderDetalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
