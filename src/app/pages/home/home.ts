import { Component } from '@angular/core';
import { EventosPerto } from "../../shared/components/home/eventos-perto/eventos-perto";
import { Categorias } from "../../shared/components/home/categorias/categorias";
import { BannerEventos } from '../../shared/components/home/banner-eventos/banner-eventos';

@Component({
  selector: 'app-home',
  imports: [BannerEventos, EventosPerto, Categorias],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
