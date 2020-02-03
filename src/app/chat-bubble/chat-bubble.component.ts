import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-bubble',
  inputs: ["mensagem:mensagem", "posicao:p"],
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss'],
})
export class ChatBubbleComponent implements OnInit {

  public mensagem:any;
  public posicao: any;
  constructor() { }

  ngOnInit() {}

}
