import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { Month } from '../types/month';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-month',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  templateUrl: './month-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthFilterComponent {
  @Output() monthSelected = new EventEmitter<Month>();
  isOpen = false;

  curentDate = new Date();
  currentMonthIndex = this.curentDate.getMonth();
  currentYear = this.curentDate.getFullYear();

  year = this.currentYear;
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  changeMonth(monthIndex: number): void {
    this.currentMonthIndex = monthIndex;
    this.currentYear = this.year;
    this.monthSelected.emit({ monthIndex, year: this.year });
    this.isOpen = false;
  }

  gotoNextYear(): void {
    this.year++;
  }

  gotoPreviousYear(): void {
    this.year--;
  }
}
