import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EventActions } from "./event-actions";

describe("EventActions", () => {
  let component: EventActions;
  let fixture: ComponentFixture<EventActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventActions],
    }).compileComponents();

    fixture = TestBed.createComponent(EventActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
