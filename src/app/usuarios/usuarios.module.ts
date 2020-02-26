import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosPageRoutingModule } from './usuarios-routing.module';

import { UsuariosPage } from './usuarios.page';
import { AdicionarComponent } from '../adicionar/adicionar.component';
import { MenuComponent } from '../menu/menu.component';
// import { DadosUsuarioComponent } from '../dados-usuario/dados-usuario.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosPageRoutingModule
  ],
  entryComponents:[AdicionarComponent, MenuComponent],
  declarations: [UsuariosPage, AdicionarComponent, MenuComponent]
})
export class UsuariosPageModule {}

