import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-organizer-form',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './organizer-form.html',
  styleUrl: './organizer-form.css'
})
export class OrganizerForm {

  private fb = inject(FormBuilder);

  @Input() carregando = false;

  @Output() formSubmit = new EventEmitter<any>();

  passoAtual = 1;

  mostrarSenha = false;
  mostrarConfirmarSenha = false;

  form = this.fb.group(
    {
      emailEmpresa: [
        '', [ Validators.required, Validators.email ]],

      telefoneEmpresa: [
        '', [ Validators.required, Validators.minLength(10)]],

      senhaOrganizador: [
        '', [ Validators.required, Validators.minLength(8) ]],

      confirmarSenhaOrganizador: [
        '', Validators.required ],

      razaoSocial: [
        '', Validators.required ],

      nomeFantasia: [
        '', Validators.required ],

      cnpj: [
        '', [ Validators.required, Validators.pattern( /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/) ]],

      ramoEmpresa: [
        '', Validators.required ],

      cep: [
        '', [ Validators.required, Validators.pattern( /^\d{5}-\d{3}$/) ]],

      estado: [
        '', Validators.required ],

      cidade: [
        '', Validators.required ],

      bairro: [
        '', Validators.required ],

      endereco: [
        '', Validators.required ],

      numero: [
        '', Validators.required ],

      complemento: ['']
    },
    {
      validators: this.validarSenhasIguais
    }
  );

  private validarSenhasIguais( control: AbstractControl ): ValidationErrors | null {
    const senha = control.get('senhaOrganizador')?.value;
    const confirmar = control.get('confirmarSenhaOrganizador')?.value;

    return senha === confirmar ? null : { senhasDiferentes: true };
  }

  alternarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  } 

  alternarConfirmarSenha(): void {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  avancarPasso(): void {
    if (!this.passoValido()) {
      this.marcarCamposPassoAtual();
      return;
    }

    if (this.passoAtual < 3) {
      this.passoAtual++;
    }
  }

  voltarPasso(): void {
    if (
      this.passoAtual > 1 && !this.carregando
    ) {
      this.passoAtual--;
    }
  }

  submeter(): void {
    if (this.carregando) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(
      this.form.getRawValue()
    );
  }

  private passoValido(): boolean {
    const valido =
      this.camposDoPassoAtual().every(
          campo =>
            this.form.get(campo)?.valid
        );

    if (
      this.passoAtual === 1 && this.form.hasError('senhasDiferentes')
    ) {
      return false;
    }
    return valido;
  }

  private marcarCamposPassoAtual(): void {
    this.camposDoPassoAtual().forEach(
        campo =>
          this.form.get(campo)?.markAsTouched()
      );
  }

  private camposDoPassoAtual(): string[] {
    switch (this.passoAtual) {

      case 1:
        return [
          'emailEmpresa',
          'telefoneEmpresa',
          'senhaOrganizador',
          'confirmarSenhaOrganizador'
        ];

      case 2:
        return [
          'razaoSocial',
          'nomeFantasia',
          'cnpj',
          'ramoEmpresa'
        ];

      case 3:
        return [
          'cep',
          'estado',
          'cidade',
          'bairro',
          'endereco',
          'numero'
        ];

      default:
        return [];
    }
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
}