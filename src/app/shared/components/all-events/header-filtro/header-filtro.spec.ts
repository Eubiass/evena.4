import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HeaderFiltro } from "./header-filtro";

describe("HeaderFiltro", () => {
  let component: HeaderFiltro;
  let fixture: ComponentFixture<HeaderFiltro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderFiltro],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderFiltro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
