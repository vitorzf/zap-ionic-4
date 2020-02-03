import { Component, OnInit } from '@angular/core';
import { Usuarios } from 'src/Models/Usuarios';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Helper } from 'src/Helpers/Helper';
import { AngularFireAuth } from 'angularfire2/auth';
import { AdicionarComponent } from '../adicionar/adicionar.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
            
})
export class UsuariosPage implements OnInit {

  listaUsuarios: Usuarios[] = [];
  public usuario_id = window.localStorage.getItem('usuario_id');
  public piscando = '';

  constructor(
    public fbauth:AngularFireAuth,
    public fbstore:AngularFirestore, 
    public alert: AlertController,
    public rota: Router,
    public helper: Helper,
    public popover: PopoverController
  ) { }

  ngOnInit() {
    this.listar_usuarios();
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
                  usuario.nome = element.data().nome;
                  usuario.email = element.data().email;
                  usuario.id = element.data().usuario_id;
                  this.listaUsuarios.push(usuario);
                }
              });
            });

          });
        });
        
        if(this.listaUsuarios.length == 0){
          this.piscando = 'piscando';
        }else{
          this.piscando = '';
        }
        
      }else{
        this.rota.navigate(['/home']);
      }
    })

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
        
      })
    })
  }

  conversar(id){
    this.rota.navigate(['/mensagens/'+id])
  }

  sair(){
    this.fbauth.auth.signOut();
    this.rota.navigate(['/home']);
  }

}
