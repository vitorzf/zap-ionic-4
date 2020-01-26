import { Component, OnInit } from '@angular/core';
import { Usuarios } from 'src/Models/Usuarios';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  usuario:Usuarios;

  constructor(
    public fbauth:AngularFireAuth, 
    public fbstore:AngularFirestore, 
    public alert: AlertController,
    public rota: Router
  ) { 
    this.usuario = new Usuarios();
  }

  ngOnInit() {
  }

  cadastrar(){
    this.fbauth.auth.createUserWithEmailAndPassword(this.usuario.email, this.usuario.senha).then(result => {

      let colecao = this.fbstore.collection("Usuarios");

      colecao.add({
        usuario_id: result.user.uid,
        nome: this.usuario.nome,
        email: this.usuario.email,
        senha: this.usuario.senha
      }).then(() => {

          this.AlertaSimples("Aviso", "", "Cadastrado com sucesso!");

          this.fbauth.auth.signInWithEmailAndPassword(this.usuario.email, this.usuario.senha).then(() => {

            this.rota.navigate(['/home']);

          })
              
      }).catch(() => {

          this.AlertaSimples("Aviso", "", "Erro ao cadastrar");

      });

    }).catch(e => {
          this.AlertaSimples("Aviso", "", "Erro ao cadastrar, erro: \n " + e);
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

}
