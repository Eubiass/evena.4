import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PriceHeader } from "./price-header";

describe("PriceHeader", () => {
  let component: PriceHeader;
  let fixture: ComponentFixture<PriceHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
