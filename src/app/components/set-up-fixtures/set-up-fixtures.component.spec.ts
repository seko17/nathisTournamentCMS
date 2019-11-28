import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetUpFixturesComponent } from './set-up-fixtures.component';

describe('SetUpFixturesComponent', () => {
  let component: SetUpFixturesComponent;
  let fixture: ComponentFixture<SetUpFixturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetUpFixturesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetUpFixturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
