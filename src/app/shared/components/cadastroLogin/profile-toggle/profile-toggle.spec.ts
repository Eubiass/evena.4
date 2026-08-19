import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProfileToggle } from "./profile-toggle";

describe("ProfileToggle", () => {
  let component: ProfileToggle;
  let fixture: ComponentFixture<ProfileToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileToggle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
