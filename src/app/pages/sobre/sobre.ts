import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [RouterLink, Header, Footer],
  templateUrl: './sobre.html',
  styleUrl: './sobre.css'
})
export class Sobre {}