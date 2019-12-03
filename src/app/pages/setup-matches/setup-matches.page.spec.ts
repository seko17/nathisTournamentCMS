import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetupMatchesPage } from './setup-matches.page';

describe('SetupMatchesPage', () => {
  let component: SetupMatchesPage;
  let fixture: ComponentFixture<SetupMatchesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupMatchesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetupMatchesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
