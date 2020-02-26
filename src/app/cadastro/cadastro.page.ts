import { Component, OnInit } from '@angular/core';
import { Usuarios } from 'src/Models/Usuarios';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage'
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Helper } from 'src/Helpers/Helper'; 
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  usuario:Usuarios;
  public loadingvar: any;

  constructor(
    public fbauth:AngularFireAuth, 
    public fbstore:AngularFirestore, 
    public alert: AlertController,
    public rota: Router,
    public helper: Helper,
    public camera: Camera,
    public imagePicker : ImagePicker,
    public file: File,
    public loading:LoadingController,
    public fs: AngularFireStorage
  ) { 
    this.usuario = new Usuarios();
    
  }

  ngOnInit() {
  }

  tirarFoto(){
    this.pickImage(this.camera.PictureSourceType.CAMERA);
  }

  escolherFoto(){
    this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  pickImage(sourceType) {
    this.mostrarLoad(true);

    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.usuario.foto = base64Image;
      this.mostrarLoad(false);
    }, (err) => {
        console.log(err);
        this.mostrarLoad(false);
    });
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
    this.mostrarLoad(true);

    let senha = this.helper.hash(this.usuario.senha);

    this.fbauth.auth.createUserWithEmailAndPassword(this.usuario.email, senha).then(result => {

      let colecao = this.fbstore.collection("Usuarios");
      let tem = false;
      colecao.ref.where("email", "==", this.usuario.email).get().then(e => {
        e.forEach(() => {
          tem = true;
        });
      })

      if(tem){
        this.AlertaSimples("Aviso", "", "Email ja cadastrado");
        return;
      }

      colecao.add({
        usuario_id: result.user.uid,
        nome: this.usuario.nome,
        email: this.usuario.email,
        senha: senha,
        telefone: this.usuario.telefone.toString()
      }).then(() => {

          if(this.usuario.foto != undefined){
            this.fs.ref("fotos/"+result.user.uid+'/foto_perfil.jpg').putString(this.usuario.foto, 'data_url').then(as => {
              console.log(as);
            }).catch(er => {
              console.log(er);
            });
          }else{
            this.fs.ref("fotos/"+result.user.uid+'/foto_perfil.jpg').putString(this.helper.semFoto(), 'data_url').then(as => {
              console.log(as);
            }).catch(er => {
              console.log(er);
            });
          }

          this.AlertaSimples("Aviso", "", "Cadastrado com sucesso!");
          this.mostrarLoad(false);
          this.fbauth.auth.signInWithEmailAndPassword(this.usuario.email, senha).then(() => {

            this.rota.navigate(['/usuarios']);

          })
              
      }).catch(e => {
          this.mostrarLoad(false);
        
          this.AlertaSimples("Aviso", "", "Erro ao cadastrar");
          console.log(e);

      });

    }).catch(e => {
          this.mostrarLoad(false);
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
}
