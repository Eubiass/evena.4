import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrganizerCard } from "./organizer-card";

describe("OrganizerCard", () => {
  let component: OrganizerCard;
  let fixture: ComponentFixture<OrganizerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerCard],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizerCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
