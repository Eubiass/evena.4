import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CategoriasNav } from "./categorias-nav";

describe("CategoriasNav", () => {
  let component: CategoriasNav;
  let fixture: ComponentFixture<CategoriasNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasNav],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
