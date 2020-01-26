import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Usuarios } from 'src/Models/Usuarios';
import { Helper } from 'src/Helpers/Helper';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  usuario:Usuarios;

  constructor(
    public fbauth:AngularFireAuth, 
    public fbstore:AngularFirestore, 
    public alert: AlertController,
    public rota: Router,
    public helper: Helper
  ) { 
    this.usuario = new Usuarios();

    this.fbauth.authState.subscribe(user=>{
      if(user){
        window.localStorage.setItem('usuario_id', user.uid);
        this.rota.navigate(['/usuarios']);
      }
    })
  }

  login(){

    if(this.helper.checaUndefined(this.usuario.email, 4)){
      this.AlertaSimples("Aviso", "", "Email não digitado");
      return;
    }

    if(this.helper.checaUndefined(this.usuario.senha, 6)){
      this.AlertaSimples("Aviso", "", "Senha digitada incorretamente");
      return;
    }

    this.fbauth.auth.signInWithEmailAndPassword(this.usuario.email, this.usuario.senha).then(() => {

      this.rota.navigate(['/home']);

    }).catch(erro => {
      console.log(erro);
      let mensagem = this.helper.traduzir(erro.code);

      if(mensagem == 'erro'){
        this.AlertaSimples("Aviso", "", "Falha ao efetuar login");
      }else{
        this.AlertaSimples("Aviso", "", mensagem);
      }

    })
  }

  async AlertaSimples(header, subheader, message){
    const alert = await this.alert.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
}

  // sair(){
  //   this.fbauth.auth.signOut();
  //   this.rota.navigate(['/home']);
  // }

}
