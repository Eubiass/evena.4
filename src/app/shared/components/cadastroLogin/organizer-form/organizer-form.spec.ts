import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrganizerForm } from "./organizer-form";

describe("OrganizerForm", () => {
  let component: OrganizerForm;
  let fixture: ComponentFixture<OrganizerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerForm],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizerForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
