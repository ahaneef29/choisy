import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileOptionsPage } from './profile-options.page';

describe('ProfileOptionsPage', () => {
  let component: ProfileOptionsPage;
  let fixture: ComponentFixture<ProfileOptionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProfileOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
