import { Component, OnInit } from '@angular/core';
import { PopoverController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss'],
})
export class AdicionarComponent implements OnInit {

  public telefone: any = null;
  public loadingvar: any = null;
  public meutelefone: any = null;

  constructor(
    public pop:PopoverController, 
    public fbauth:AngularFireAuth, 
    public fbstore:AngularFirestore,
    public loading: LoadingController,
    public alert: AlertController
  ) { }

  ngOnInit() {}

  adicionar(){

    if(this.telefone.length < 11){
      this.AlertaSimples("Erro", '', "O número foi digitado incorretametne");
      return;
    }
    this.mostrarLoad(true);
    this.fbauth.authState.subscribe(user => {
      if(user){

        let users = this.fbstore.collection('Usuarios');
        users.ref.where("usuario_id", "==", user.uid).get().then(result => {
            result.forEach(e => {
    
              this.meutelefone = e.data().telefone;

              if(this.telefone == e.data().telefone){
                this.mostrarLoad(false);
                this.AlertaSimples("Erro", '', "Você não pode adicionar a si mesmo");
                return;
              }

        users.ref.where("telefone", "==", this.telefone).get().then(result => {
          if(result.size == 0){
            this.mostrarLoad(false);
            this.AlertaSimples("Erro", '', "Nenhum usuário cadastrado com o número fornecido"); 
            return;
          }
          result.forEach(f => {

            let msg = this.fbstore.collection("Mensagens");

            // msg.ref.where('de', '==', user.uid).get().then(m => {
            //   m.forEach(s => {
            //     if(s.data().para == f.data().usuario_id){
            //       this.AlertaSimples("Erro", '', "Você ja tem este usuario nos seus amigos"); 
            //       return;
            //     }
            //   });
            // });

            // msg.ref.where('para', '==', user.uid).get().then(m => {
            //   m.forEach(s => {
            //     if(s.data().de == f.data().usuario_id){
            //       this.AlertaSimples("Erro", '', "Você ja tem este usuario nos seus amigos"); 
            //       return;
            //     }
            //   });
            // });

            msg.add({
              de: user.uid,
              para: f.data().usuario_id,
              texto: "😁",
              data: new Date()
            });

            this.mostrarLoad(false);
            this.pop.dismiss();
            });
          });
        });
      });
    }
  });
}

  fechar(){
    this.pop.dismiss();
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


}
