import { Component, OnInit } from '@angular/core';
import { PopoverController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { AngularFireStorage } from 'angularfire2/storage';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public foto_usuario = window.localStorage.getItem('foto_usuario');
  public trocandoFoto:boolean = false;
  public loadingvar:any;
  public foto64:any;

  constructor(
    public pop: PopoverController,
    public loading: LoadingController,
    public alert: AlertController,
    public fbauth: AngularFireAuth,
    public rota:Router,
    public camera: Camera,
    public imagePicker : ImagePicker,
    public file: File,
    public fs: AngularFireStorage
  ) { }

  ngOnInit() {}

  sair(){
    this.fbauth.auth.signOut();
    this.rota.navigate(['/home']);
    this.pop.dismiss();
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
      this.foto64 = base64Image;

      setTimeout(() => {
        this.alerta();
      }, 100);
      this.mostrarLoad(false);
    }, (err) => {
        console.log(err);
        this.mostrarLoad(false);
    });
  }

  salvarAlteracao(){

    this.fbauth.authState.subscribe(user=>{
      if(user){
        this.fs.ref("fotos/"+user.uid+'/foto_perfil.jpg').putString(this.foto64, 'data_url').then(as => {
          this.fs.ref("fotos/"+user.uid+"/foto_perfil.jpg").getDownloadURL().subscribe(url => {
            window.localStorage.setItem('foto_usuario', url);
          })
          this.buscarFoto();
          this.pop.dismiss();
        }).catch(er => {
          console.log(er);
        });
      }
    });
    
  }

  buscarFoto(){
      this.fbauth.authState.subscribe(user => {
        if(user){
            this.fs.ref("fotos/"+user.uid+"/foto_perfil.jpg").getDownloadURL().subscribe(url => {
            window.localStorage.setItem('foto_usuario', url);
          })
        }
      }); 
  }

  async alerta(){
    let alert = await this.alert.create({
      header: 'Deseja mesmo alterar sua foto?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.salvarAlteracao();
          }
        }
      ]
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
