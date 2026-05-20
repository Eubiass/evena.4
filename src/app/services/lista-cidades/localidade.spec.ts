import { TestBed } from "@angular/core/testing";

import { Localidade } from "./localidade";

describe("Localidade", () => {
  let service: Localidade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Localidade);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
