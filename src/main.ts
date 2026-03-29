import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

//To Debugging in IOS 
// https://frida.re/docs/ios/

//Compiling and Build IOS without Xcode
//https://xtool.sh/documentation/xtool/installation-linux/

//Compiling to IOS
//https://capacitorjs.com/docs/v2/basics/building-your-app


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
