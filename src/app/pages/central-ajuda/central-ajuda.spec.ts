import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CentralAjuda } from "./central-ajuda";

describe("CentralAjuda", () => {
  let component: CentralAjuda;
  let fixture: ComponentFixture<CentralAjuda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentralAjuda],
    }).compileComponents();

    fixture = TestBed.createComponent(CentralAjuda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
