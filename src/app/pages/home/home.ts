import { Component } from '@angular/core';
import { EventosPerto } from '../../shared/components/home/eventos-perto/eventos-perto';
import { Categorias } from '../../shared/components/home/categorias/categorias';
import { BannerEventos } from '../../shared/components/home/banner-eventos/banner-eventos';
import { OrganizeSeuEvento } from '../../shared/components/home/organize-seu-evento/organize-seu-evento';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [
    BannerEventos,
    EventosPerto,
    Categorias,
    OrganizeSeuEvento,
    Header,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
