import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component'
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { LoadingMaskModule } from './loading-mask/loading-mask.module'
import { SafePipe } from './safe.pipe'

@NgModule({
  declarations: [
    AppComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    LoadingMaskModule.forRoot({
      snippet: {
        imgUrl: 'http://littlelyon.com/ngx-loading-mask/assets/ripple.svg',
        size: 144
      },
      debug: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
