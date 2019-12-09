import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetfixturePage } from './setfixture.page';

describe('SetfixturePage', () => {
  let component: SetfixturePage;
  let fixture: ComponentFixture<SetfixturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetfixturePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetfixturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
