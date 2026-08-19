import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BrandSideAuth } from "./brand-side-auth";

describe("BrandSideAuth", () => {
  let component: BrandSideAuth;
  let fixture: ComponentFixture<BrandSideAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandSideAuth],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandSideAuth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
