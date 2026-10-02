import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CabecalhoOrganizador } from "./cabecalho-organizador";

describe("CabecalhoOrganizador", () => {
  let component: CabecalhoOrganizador;
  let fixture: ComponentFixture<CabecalhoOrganizador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabecalhoOrganizador],
    }).compileComponents();

    fixture = TestBed.createComponent(CabecalhoOrganizador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
