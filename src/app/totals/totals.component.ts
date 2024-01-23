import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Totals } from '../types/totals';

@Component({
  selector: 'app-totals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalsComponent {
  @Input() totals!: Totals | null;
}
