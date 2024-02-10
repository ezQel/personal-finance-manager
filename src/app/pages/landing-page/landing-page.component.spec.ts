import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let fixture: ComponentFixture<LandingPageComponent>;
  let component: LandingPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent, RouterTestingModule.withRoutes(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the landing page', () => {
    expect(component).toBeTruthy();
  });

  it('should have demo button', () => {
    const demoButton = fixture.nativeElement.querySelector('#btn-demo');
    expect(demoButton).toBeTruthy();
  });
});
