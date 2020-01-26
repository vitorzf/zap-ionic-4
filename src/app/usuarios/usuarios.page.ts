import { Component, OnInit } from '@angular/core';
import { Usuarios } from 'src/Models/Usuarios';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Helper } from 'src/Helpers/Helper';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  listaUsuarios: Usuarios[]
  public usuario_id = window.localStorage.getItem('usuario_id');

  constructor(
    public fbauth:AngularFireAuth,
    public fbstore:AngularFirestore, 
    public alert: AlertController,
    public rota: Router,
    public helper: Helper
  ) { }

  ngOnInit() {
    this.listar_usuarios();
  }
  
  listar_usuarios(){

    let users = this.fbstore.collection('Usuarios');

    this.listaUsuarios = [];

    users.ref.where('userid', "<", this.usuario_id ).get().then(result => {

      console.log(result);

      result.forEach(e => {

        // let usuario = new Usuarios();

        // usuario.nome = e.data().nome;
        // usuario.email = e.data().email;
        // usuario.id = e.id;

        // this.listaUsuarios.push(usuario);
        
      });

    });

    // users.ref.where('userid', "<", this.usuario_id ).get().then(result => {

    //   result.forEach(e => {

    //     let usuario = new Usuarios();

    //     usuario.nome = e.data().nome;
    //     usuario.email = e.data().email;
    //     usuario.id = e.id;

    //     this.listaUsuarios.push(usuario);
        
    //   });

    // });

  }

  sair(){
    this.fbauth.auth.signOut();
    this.rota.navigate(['/home']);
  }

}
