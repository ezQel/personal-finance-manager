import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Shows the provided input message with error styling
 */
@Component({
  selector: 'app-error-message',
  standalone: true,
  templateUrl: './error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  @Input() message?: string | null;
}
