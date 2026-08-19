import { Component, EventEmitter, inject, Output } from "@angular/core";
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";

@Component({
  selector: "app-organizer-form",
  imports: [ReactiveFormsModule],
  templateUrl: "./organizer-form.html",
  styleUrl: "./organizer-form.css",
})
export class OrganizerForm {
  private fb = inject(FormBuilder);

  @Output() formSubmit = new EventEmitter<any>();

  passoAtual = 1;

  // Estrutura do formulário com validações
  form = this.fb.group({
    // Passo 1
    emailEmpresa: ['', [Validators.required, Validators.email]],
    telefoneEmpresa: ['', [Validators.required, Validators.minLength(10)]],
    senhaOrganizador: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenhaOrganizador: ['', [Validators.required]],
    
    // Passo 2
    razaoSocial: ['', [Validators.required]],
    nomeFantasia: ['', [Validators.required]],
    cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]], // Exige 14 dígitos
    ramoEmpresa: ['', [Validators.required]],

    // Passo 3
    cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    estado: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    endereco: ['', [Validators.required]],
    numero: ['', [Validators.required]],
    complemento: ['']
  }, { validators: this.validarSenhasIguais });

  // Validador customizado para comparar as senhas
  private validarSenhasIguais(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senhaOrganizador')?.value;
    const confirma = control.get('confirmarSenhaOrganizador')?.value;
    return senha === confirma ? null : { senhasDiferentes: true };
  }

  avancarPasso() {
    if (this.passoAtual < 3) this.passoAtual++;
  }

  voltarPasso() {
    if (this.passoAtual > 1) this.passoAtual--;
  }

  submeter() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.form.value);
  }
}
