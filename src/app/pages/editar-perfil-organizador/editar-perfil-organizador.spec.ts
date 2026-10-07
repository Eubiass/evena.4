import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditarPerfilOrganizador } from "./editar-perfil-organizador";

describe("EditarPerfilOrganizador", () => {
  let component: EditarPerfilOrganizador;
  let fixture: ComponentFixture<EditarPerfilOrganizador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPerfilOrganizador],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPerfilOrganizador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
