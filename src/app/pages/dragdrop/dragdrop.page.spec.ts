import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DragdropPage } from './dragdrop.page';

describe('DragdropPage', () => {
  let component: DragdropPage;
  let fixture: ComponentFixture<DragdropPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragdropPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DragdropPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
