import { Component, OnInit } from '@angular/core';
import { Usuarios } from 'src/Models/Usuarios';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Helper } from 'src/Helpers/Helper';
import { AngularFireAuth } from 'angularfire2/auth';
import { AdicionarComponent } from '../adicionar/adicionar.component';
import { DadosUsuarioComponent } from '../dados-usuario/dados-usuario.component';
import { MenuComponent } from '../menu/menu.component';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
            
})
export class UsuariosPage implements OnInit {

  listaUsuarios: Usuarios[] = [];
  public usuario_id = window.localStorage.getItem('usuario_id');
  public piscando = '';
  public foto_usuario:any = window.localStorage.getItem('foto_usuario');

  constructor(
    public fbauth:AngularFireAuth,
    public fbstore:AngularFirestore, 
    public alert: AlertController,
    public rota: Router,
    public helper: Helper,
    public popover: PopoverController,
    public fs: AngularFireStorage
  ) { }

  ngOnInit() {
    this.buscarFoto();
    this.listar_usuarios();
    
  }

  buscarFoto(id = null){
    
    if(id == null){
      this.fbauth.authState.subscribe(user => {
        if(user){
          this.fs.ref("fotos/"+user.uid+"/foto_perfil.jpg").getDownloadURL().subscribe(url => {
            window.localStorage.setItem('foto_usuario', url);
            this.foto_usuario = url;
          })
        }
      });
    }else{
      this.fs.ref("fotos/"+id+"/foto_perfil.jpg").getDownloadURL().subscribe(url => {
        return url;
      })
    }
    
    return "semfoto";
  }
  
  listar_usuarios(){

    this.fbauth.authState.subscribe(user => {
      if(user){

        let mensagens = this.fbstore.collection('Mensagens');
        
        mensagens.ref.where('de', "==", user.uid).get().then(result => {

          result.forEach(e => {

            let usuarios = this.fbstore.collection("Usuarios");
            usuarios.ref.where('usuario_id', '==', e.data().para).get().then(r => {
              r.forEach(element => {
                
                let jatem = false;
                this.listaUsuarios.forEach(us => {
                  if(us.id == element.data().usuario_id){
                    jatem = true;
                  }
                });
                if(jatem == false){
                  let usuario = new Usuarios();
                  this.fs.ref("fotos/"+element.data().usuario_id+"/foto_perfil.jpg").getDownloadURL().subscribe(url => {
                    usuario.foto = url;
                  })
                  usuario.nome = element.data().nome;
                  usuario.email = element.data().email;
                  usuario.id = element.data().usuario_id;
                  this.listaUsuarios.push(usuario);
                }
              });
            });

          });
        });

        mensagens.ref.where('para', "==", user.uid).get().then(result => {

          result.forEach(e => {

            let usuarios = this.fbstore.collection("Usuarios");
            usuarios.ref.where('usuario_id', '==', e.data().de).get().then(r => {
              r.forEach(element => {
                let jatem = false;
                this.listaUsuarios.forEach(us => {
                  if(us.id == element.data().usuario_id){
                    jatem = true;
                  }
                });
                if(jatem == false){
                  let usuario = new Usuarios();
                  this.fs.ref("fotos/"+element.data().usuario_id+"/foto_perfil.jpg").getDownloadURL().subscribe(url => {
                    usuario.foto = url;
                  })
                  usuario.nome = element.data().nome;
                  usuario.email = element.data().email;
                  usuario.id = element.data().usuario_id;
                  this.listaUsuarios.push(usuario);
                }
              });
            });

          });
        });
        
      }else{
        this.rota.navigate(['/home']);
      }
    })

  }

  async abrir_menu(ev: any){
    const pop = await this.popover.create({
      component:MenuComponent,
      event:ev,
      translucent:true,
      
    });
    pop.onWillDismiss().then(() => {
      this.buscarFoto();
    });
    return await pop.present();
  }

  async dados_user(ev: any = null){
    const pop = await this.popover.create({
      component:DadosUsuarioComponent,
      translucent:true,
      componentProps:{
        usuario: ev
      }
    });
    return await pop.present();
  }

  async adicionar_amigo(event){
    const pop = await this.popover.create({
      component:AdicionarComponent,
      translucent:true
    });
    pop.onWillDismiss().then(() => {
      this.listar_usuarios();
    });
    return await pop.present();
  }

  dadosUsuario(id){
    let users = this.fbstore.collection("Usuarios");

    users.ref.where("usuario_id", "==", id).get().then(e => {
      e.forEach(a => {

        this.fs.ref("fotos/"+id+"/foto_perfil.jpg").getDownloadURL().subscribe(url => {
 
          let dados_usu = {
            id:a.data().usuario_id,
            nome:a.data().nome,
            telefone:a.data().telefone,
            email:a.data().email,
            foto:url
          };
          this.dados_user(dados_usu);
    
        })
      })
    })
  }

  conversar(id){
    this.rota.navigate(['/mensagens/'+id])
  }

}
