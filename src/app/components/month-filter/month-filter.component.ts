import { OverlayModule } from '@angular/cdk/overlay';
import { NgClass, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Month } from '../../types/month';

/**
 * Allows selection of a month and emits a `Month` Object
 */
@Component({
  selector: 'app-month-filter',
  standalone: true,
  imports: [NgClass, SlicePipe, OverlayModule],
  templateUrl: './month-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthFilterComponent {
  /**
   * Event dispatched whenever the current month changes
   */
  @Output() monthChanged = new EventEmitter<Month>();

  /**
   * Visibility state of the month filter overlay
   */
  isOpen = false;

  /**
   * Used to get the default active month/year
   */
  curentDate = new Date();

  /**
   * Used to show or hide the year on the overlay toggle. The year is not shown if it is the current year
   */
  currentYear = this.curentDate.getFullYear();

  /**
   * This is the year that visible to the user on the month filter overlay and can be changed using the left and right arrows
   */
  displayedYear = this.currentYear;

  /**
   * The selected/active month and year combo
   */
  activeMonth: Month = { monthIndex: this.curentDate.getMonth(), year: this.currentYear };

  /**
   * List of all the months in a year to be displayed in the overlay
   */
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  /**
   * Sets the activeMonth to the selected month details
   * @param monthIndex The index of the selected month
   */
  setMonth(monthIndex: number): void {
    this.activeMonth.monthIndex = monthIndex;
    this.activeMonth.year = this.displayedYear;
    this.monthChanged.emit(this.activeMonth);
    this.isOpen = false; // Close overlay
  }

  /**
   * Displays the next year when the right arrow is clicked
   */
  gotoNextYear(): void {
    this.displayedYear++;
  }

  /**
   * Displays the previous year when the left arrow is clicked
   */
  gotoPreviousYear(): void {
    this.displayedYear--;
  }
}
