import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetfixturesPage } from './setfixtures.page';

describe('SetfixturesPage', () => {
  let component: SetfixturesPage;
  let fixture: ComponentFixture<SetfixturesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetfixturesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetfixturesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
