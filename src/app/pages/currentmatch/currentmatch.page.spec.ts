import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CurrentmatchPage } from './currentmatch.page';

describe('CurrentmatchPage', () => {
  let component: CurrentmatchPage;
  let fixture: ComponentFixture<CurrentmatchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentmatchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentmatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
