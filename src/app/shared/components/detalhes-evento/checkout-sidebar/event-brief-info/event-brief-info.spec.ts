import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EventBriefInfo } from "./event-brief-info";

describe("EventBriefInfo", () => {
  let component: EventBriefInfo;
  let fixture: ComponentFixture<EventBriefInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventBriefInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(EventBriefInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
