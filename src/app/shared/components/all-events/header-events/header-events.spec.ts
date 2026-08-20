import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HeaderEvents } from "./header-events";

describe("HeaderEvents", () => {
  let component: HeaderEvents;
  let fixture: ComponentFixture<HeaderEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderEvents],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
