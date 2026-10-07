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
    senhaOrganizador: ['', [Validators.required, Validators.minLength(8)]],
    confirmarSenhaOrganizador: ['', [Validators.required]],
    
    // Passo 2
    razaoSocial: ['', [Validators.required]],
    nomeFantasia: ['', [Validators.required]],
    cnpj: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)]],
    ramoEmpresa: ['', [Validators.required]],

    // Passo 3
    cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
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

  formatarCnpj(event: Event): void {
    const input = event.target as HTMLInputElement;

    let valor = input.value.replace(/\D/g, '');

    valor = valor.substring(0, 14);

    if (valor.length > 12) {
      valor = valor.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/,
        '$1.$2.$3/$4-$5'
      );
    } else if (valor.length > 8) {
      valor = valor.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{0,4}).*/,
        '$1.$2.$3/$4'
      );
    } else if (valor.length > 5) {
      valor = valor.replace(
        /^(\d{2})(\d{3})(\d{0,3}).*/,
        '$1.$2.$3'
      );
    } else if (valor.length > 2) {
      valor = valor.replace(
        /^(\d{2})(\d{0,3}).*/,
        '$1.$2'
      );
    }

    this.form.get('cnpj')?.setValue(valor);
  }

  formatarCep(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    let valor = input.value.replace(/\D/g, '');
    
    valor = valor.substring(0, 8);
    
    if (valor.length > 5) {
      valor = valor.replace(
        /^(\d{5})(\d{0,3}).*/,
        '$1-$2'
      );
    }
  
    this.form.get('cep')?.setValue(valor);
  }

  submeter() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.form.value);
  }
}
