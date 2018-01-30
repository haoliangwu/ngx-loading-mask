import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSnipComponent } from './loading-snip.component';

describe('LoadingSnipComponent', () => {
  let component: LoadingSnipComponent;
  let fixture: ComponentFixture<LoadingSnipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingSnipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingSnipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
