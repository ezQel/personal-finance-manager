import { TitleCasePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { Category } from '../../types/category';
import { TransactionType } from '../../types/transaction-type';

/**
 * Lists and allows adding of categories of the type specified in the dialog data
 */
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    TitleCasePipe,
    ErrorMessageComponent,
  ],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  /**
   * Used for diabling the save button while saving to avoid saving category multiple times
   */
  saving = false;

  /**
   * Message to be shownto the user in case of an error while saving or deleting a category
   */
  errorMessage?: string | null;

  /**
   * List of all categories
   */
  categories?: Category[];

  categoryForm = new FormGroup({
    _id: new FormControl(),
    name: new FormControl(),
    type: new FormControl(),
  });

  constructor(private _app: AppService, @Inject(MAT_DIALOG_DATA) public type: TransactionType) {}

  ngOnInit(): void {
    // Set the category type to the type of transaction that was being added in the transaction modal
    this.categoryForm.get('type')?.setValue(this.type);
    this.getCategories();
  }

  getCategories(): void {
    this._app.getCategories().then((categories) => {
      // Show only categories of the transaction type that was being added
      this.categories = categories.filter((cat) => cat.type === this.type);
    });
  }

  saveCategory(): void {
    this.saving = true;
    this.errorMessage = null;
    const category = <Category>this.categoryForm.value;
    category._id = String(Date.now());
    category.type = this.type;

    this._app
      .addCategory(category)
      .then(() => {
        this.getCategories();
        this.categoryForm.reset();
        this.saving = false;
      })
      .catch((error) => {
        this.errorMessage = error.message;
        this.saving = false;
      });
  }

  deleteCategory(category: Category): void {
    this._app
      .deleteCategory(category)
      .then(() => {
        this.categoryForm.reset();
        this.getCategories();
      })
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }
}
