import { TestBed, async } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { BrowserModule } from '@angular/platform-browser'
import { LoadingMaskModule } from './loading-mask/loading-mask.module'
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
      ]
    }).compileComponents()
  }))
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  }))
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app.title).toEqual('ngx-loading-mask')
  }))
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ngx-loading-mask!')
  }))
})
