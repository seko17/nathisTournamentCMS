import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CurrtournPage } from './currtourn.page';

describe('CurrtournPage', () => {
  let component: CurrtournPage;
  let fixture: ComponentFixture<CurrtournPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrtournPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrtournPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
