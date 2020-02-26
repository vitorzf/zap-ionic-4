import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
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
  public loadingvar:any;

  constructor(
    public fbauth:AngularFireAuth, 
    public fbstore:AngularFirestore, 
    public alert: AlertController,
    public rota: Router,
    public helper: Helper,
    public loading: LoadingController,
    public platform: Platform
  ) { 
    this.usuario = new Usuarios();

    this.fbauth.authState.subscribe(user=>{
      if(user){
        this.rota.navigate(['/usuarios']);
      }
    });

    this.backButtonEvent();
  }

  ionViewWillEnter(){
    this.fbauth.authState.subscribe(user=>{
      if(user){
        this.rota.navigate(['/usuarios']);
      }
    });
  }

  backButtonEvent(){
    this.platform.backButton.subscribeWithPriority(0, () => {
      
      if(this.rota.url == '/usuarios'){
        this.pergunta();
      }
      
    });
  }

  async pergunta(){
    let alert = await this.alert.create({
      message: 'Deseja sair da sua conta?',
      buttons: [{
        text: 'Não',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {}
      }, {
        text: 'Sim',
        handler: () => {
          this.sair();
        }
      }]
    });

    await alert.present();
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
    
    this.mostrarLoad(true);

    let senha = this.helper.hash(this.usuario.senha);

    this.fbauth.auth.signInWithEmailAndPassword(this.usuario.email, senha).then(() => {
      
      this.mostrarLoad(false);
      this.usuario.email = '';
      this.usuario.senha = '';
      this.rota.navigate(['/home']);

    }).catch(erro => {
      this.mostrarLoad(false);
      let mensagem = this.helper.traduzir(erro.code);

      if(mensagem == 'erro'){
        this.AlertaSimples("Aviso", "", "Falha ao efetuar login");
      }else{
        this.AlertaSimples("Aviso", "", mensagem);
      }

    })
  }

  async mostrarLoad(a) {
    if(a == true){
      this.loadingvar = await this.loading.create({
        message: 'Aguarde...',
        translucent: true,
      });
  
      this.loadingvar.present();
    }else{
      this.loadingvar.dismiss();
    }
    
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

  sair(){
    this.fbauth.auth.signOut();
    this.rota.navigate(['/home']);
  }

}
