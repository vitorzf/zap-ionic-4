import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-dados-usuario',
  templateUrl: './dados-usuario.component.html',
  styleUrls: ['./dados-usuario.component.scss'],
})
export class DadosUsuarioComponent implements OnInit {

  public dados:any;

  constructor(public params:NavParams, public popover: PopoverController, public photov: PhotoViewer) { }

  ngOnInit() {

    this.dados = this.params.get('usuario');

  }

  verFoto(nome, foto){
    this.photov.show(foto, 'Imagem de perfil de '+nome, {share: false});
    
  }

  fechar(){
    this.popover.dismiss();
  }

}
