import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'


import { AppComponent } from './app.component'
import { LoadingMaskModule } from './loading-mask/loading-mask.module'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LoadingMaskModule.forRoot({
      snippet: {
        imgUrl: '/assets/ripple.svg',
        size: 144
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
