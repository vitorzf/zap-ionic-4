import { Component, OnInit } from '@angular/core';
import { Usuarios } from 'src/Models/Usuarios';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Helper } from 'src/Helpers/Helper'; 
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileChooser  } from '@ionic-native/file-chooser/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

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
    public rota: Router,
    public helper: Helper,
    public camera: Camera,
    public fc: FileChooser,
    public fp: FilePath,
    public b64: Base64
  ) { 
    this.usuario = new Usuarios();
    
  }

  ngOnInit() {
  }

  tirarFoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((ImageData) => {
      let base64Image = 'data:image/jpeg;base64,' + ImageData;
      this.usuario.foto = base64Image;
    }).catch(error => {

    });

  }

  escolherFoto(){
    this.fc.open().then(uri => {
      this.fp.resolveNativePath(uri).then(a => {
        console.log(a);
      }).catch(error => {
        console.log(error);
      })
    }).catch(e => 
      console.log(e)
    )
  }

  cadastrar(){

    if(this.usuario.nome.length < 3){
      this.AlertaSimples("Aviso", "", "Nome de usuário muito pequeno");
      return;
    }

    if(this.usuario.email.length < 6){
      this.AlertaSimples("Aviso", "", "Email digitado incorretamente");
      return;
    }

    if(this.usuario.senha.length < 6){
      this.AlertaSimples("Aviso", "", "A senha deve conter no mínimo 6 digitos");
      return;
    }

    if(this.usuario.telefone.length < 11){
      this.AlertaSimples("Aviso", "", "Numero do celular digitado incorretamente");
      return;
    }

    let senha = this.helper.hash(this.usuario.senha);

    this.fbauth.auth.createUserWithEmailAndPassword(this.usuario.email, senha).then(result => {

      let colecao = this.fbstore.collection("Usuarios");

      colecao.add({
        usuario_id: result.user.uid,
        nome: this.usuario.nome,
        email: this.usuario.email,
        senha: senha,
        telefone: this.usuario.telefone
      }).then(() => {

          this.AlertaSimples("Aviso", "", "Cadastrado com sucesso!");

          this.fbauth.auth.signInWithEmailAndPassword(this.usuario.email, senha).then(() => {

            this.rota.navigate(['/usuarios']);

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
