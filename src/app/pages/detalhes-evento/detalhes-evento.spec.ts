import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DetalhesEvento } from "./detalhes-evento";

describe("DetalhesEvento", () => {
  let component: DetalhesEvento;
  let fixture: ComponentFixture<DetalhesEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesEvento],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesEvento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
