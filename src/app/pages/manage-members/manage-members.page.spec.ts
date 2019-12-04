import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageMembersPage } from './manage-members.page';

describe('ManageMembersPage', () => {
  let component: ManageMembersPage;
  let fixture: ComponentFixture<ManageMembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMembersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
