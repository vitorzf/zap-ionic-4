import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Mensagens } from 'src/Models/Mensagens';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-mensagens',
  templateUrl: './mensagens.page.html',
  styleUrls: ['./mensagens.page.scss'],
})

export class MensagensPage implements OnInit {

  // @ViewChildren(IonContent) content: IonContent;
  @ViewChild(IonContent,{static: false}) content: IonContent;


  usuariomensagem:string;
  usuario:string;
  texto:string;
  mensagem:Mensagens;
  lista:Observable<Mensagens[]>
  listaMensagens:Observable<Mensagens[]>
  totalMensagens = 20;
  nome_usuario: string;
  pushing: boolean = false;

  constructor(
    public fbauth:AngularFireAuth,
    public rota: Router,
    public acrroute:ActivatedRoute,
    public fbstore:AngularFirestore
  ) { 

    this.mensagem = new Mensagens();
    this.acrroute.paramMap.subscribe((params:ParamMap) => {
      this.usuariomensagem = params.get('id');
    });

    this.ListarMensagens();

    setTimeout(() => {
      this.getUser();  
    }, 100);
   

  }

  ngOnInit() {
    this.verificaLogin();
  }

  getUser(){

    let users = this.fbstore.collection('Usuarios');
    users.ref.where("usuario_id", "==", this.usuariomensagem).get().then(result => {
        result.forEach(e => {
          
          this.nome_usuario = e.data().nome;

        });
    });

  }

  buscarMais(e = null, a = false){
    
    this.pushing = a;
    let maismsg = this.totalMensagens + 20;
    this.ListarMensagens(maismsg);
    if(a){
      e.target.complete();
    }
    
  }

  ListarMensagens(carregar = 20){
    this.totalMensagens = carregar;
    this.lista = this.fbstore.collection<Mensagens>("Mensagens", ref => {
      return ref.limitToLast(carregar).orderBy("data")
    }).valueChanges();

    this.lista.subscribe(res => {
        this.filtrarLista(res);
    })

  }

  ScrollToBottom(){
    if(this.content != undefined){
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 100);
    }else{
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 500);
    }
    
  }

  filtrarLista(res){
    this.listaMensagens = res.filter(t => (t.de==this.usuario && t.para== this.usuariomensagem) || (t.para==this.usuario && t.de== this.usuariomensagem));
    if(!this.pushing){
      this.ScrollToBottom();
    }
    
  }

  verificaLogin(){
    this.fbauth.authState.subscribe(user=>{
     
      if(user){
         this.usuario = user.uid;
      }else{
        this.rota.navigate['/home'];
      }
    })
  }

  enviarMensagem(){
    if(this.texto == ""){
      return;
    }
    if(this.texto == null){
      return;
    }
    let total = 0;
    this.listaMensagens.forEach(a=> {
      total = total + 1;
    })

    this.mensagem.de = this.usuario;
    this.mensagem.para = this.usuariomensagem;
    this.mensagem.texto = this.texto;
    this.mensagem.data = new Date();

    let msg = this.fbstore.collection("Mensagens");

    msg.add({
      de: this.mensagem.de,
      para: this.mensagem.para,
      texto: this.mensagem.texto,
      data: this.mensagem.data
    });

    if(total > this.totalMensagens){
      
      this.buscarMais();
      
    }

    }
}
