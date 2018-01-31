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
        imgUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiIGhlaWdodD0iMjAwcHgiCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtcmlwcGxlIiBzdHlsZT0iYmFja2dyb3VuZDogbm9uZTsiPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjE2LjY4NDMiIGZpbGw9Im5vbmUiIG5nLWF0dHItc3Ryb2tlPSJ7e2NvbmZpZy5jMX19IiBuZy1hdHRyLXN0cm9rZS13aWR0aD0ie3tjb25maWcud2lkdGh9fSIgc3Ryb2tlPSIjZmFjZDllIiBzdHJva2Utd2lkdGg9IjIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgY2FsY01vZGU9InNwbGluZSIgdmFsdWVzPSIwOzQwIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjIiIGtleVNwbGluZXM9IjAgMC4yIDAuOCAxIiBiZWdpbj0iLTFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgY2FsY01vZGU9InNwbGluZSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMiIga2V5U3BsaW5lcz0iMC4yIDAgMC44IDEiIGJlZ2luPSItMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMzUuMzM5NiIgZmlsbD0ibm9uZSIgbmctYXR0ci1zdHJva2U9Int7Y29uZmlnLmMyfX0iIG5nLWF0dHItc3Ryb2tlLXdpZHRoPSJ7e2NvbmZpZy53aWR0aH19IiBzdHJva2U9IiMzODk3OTgiIHN0cm9rZS13aWR0aD0iMiI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiBjYWxjTW9kZT0ic3BsaW5lIiB2YWx1ZXM9IjA7NDAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMiIga2V5U3BsaW5lcz0iMCAwLjIgMC44IDEiIGJlZ2luPSIwcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGNhbGNNb2RlPSJzcGxpbmUiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjIiIGtleVNwbGluZXM9IjAuMiAwIDAuOCAxIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+CiAgPC9jaXJjbGU+Cjwvc3ZnPgo=',
        size: 144
      },
      debug: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
