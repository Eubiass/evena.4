import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HeaderPerfilUsuario } from "./header-perfil-usuario";

describe("HeaderPerfilUsuario", () => {
  let component: HeaderPerfilUsuario;
  let fixture: ComponentFixture<HeaderPerfilUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPerfilUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderPerfilUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
