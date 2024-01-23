import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './category-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryAddComponent { }
