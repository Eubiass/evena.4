import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PerfilOrganizador } from "./perfil-organizador";

describe("PerfilOrganizador", () => {
  let component: PerfilOrganizador;
  let fixture: ComponentFixture<PerfilOrganizador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilOrganizador],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilOrganizador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
