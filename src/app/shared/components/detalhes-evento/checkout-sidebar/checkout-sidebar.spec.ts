import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CheckoutSidebar } from "./checkout-sidebar";

describe("CheckoutSidebar", () => {
  let component: CheckoutSidebar;
  let fixture: ComponentFixture<CheckoutSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
