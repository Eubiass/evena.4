import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GridEvents } from "./grid-events";

describe("GridEvents", () => {
  let component: GridEvents;
  let fixture: ComponentFixture<GridEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridEvents],
    }).compileComponents();

    fixture = TestBed.createComponent(GridEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
