import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage'
import { Helper } from 'src/Helpers/Helper';
import { Camera } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { DadosUsuarioComponent } from './dados-usuario/dados-usuario.component';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

var firebaseConfig = {
  apiKey: "AIzaSyC3YlpxyVnFPSbUyh3U2MF7QBS7xNgRigw",
  authDomain: "chationic4-832d7.firebaseapp.com",
  databaseURL: "https://chationic4-832d7.firebaseio.com",
  projectId: "chationic4-832d7",
  storageBucket: "chationic4-832d7.appspot.com",
  messagingSenderId: "971763806263",
  appId: "1:971763806263:web:bb0f73a50eb0515bca8fb2"
};

@NgModule({
  declarations: [AppComponent, DadosUsuarioComponent],
  entryComponents: [DadosUsuarioComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(firebaseConfig)],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireModule,
    AngularFireAuth,
    AngularFirestore,
    AngularFireStorage,
    Helper,
    Camera,
    File,
    ImagePicker,
    PhotoViewer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
