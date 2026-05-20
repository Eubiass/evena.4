import { TestBed } from "@angular/core/testing";

import { FiltroEventosService } from "./filtro-eventos-service";

describe("FiltroEventosService", () => {
  let service: FiltroEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltroEventosService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
