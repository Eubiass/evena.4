import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrganizeSeuEvento } from "./organize-seu-evento";

describe("OrganizeSeuEvento", () => {
  let component: OrganizeSeuEvento;
  let fixture: ComponentFixture<OrganizeSeuEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizeSeuEvento],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizeSeuEvento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
