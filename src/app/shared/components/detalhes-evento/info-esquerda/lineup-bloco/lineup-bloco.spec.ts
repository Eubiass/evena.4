import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LineupBloco } from "./lineup-bloco";

describe("LineupBloco", () => {
  let component: LineupBloco;
  let fixture: ComponentFixture<LineupBloco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineupBloco],
    }).compileComponents();

    fixture = TestBed.createComponent(LineupBloco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
