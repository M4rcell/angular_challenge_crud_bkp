import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import * as dayjs from 'dayjs';
import { FinanceService } from 'src/app/services/finance.service';
import { ActivatedRoute } from '@angular/router';
import { Finance } from 'src/app/core/models/finance.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnDestroy {
  subscription = new Subscription();

  addForm!: FormGroup;

  productId: string = '';
  disableProductId: boolean = false;

  constructor(
    private fb: FormBuilder,
    private financeService: FinanceService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id')!;
    });

    if (!this.productId) {
      this.disableProductId = false;
      this.formAdd();
    } else {
      this.subscription.add(
        this.financeService.getSharetProductFinance().subscribe(
          response => {
            this.disableProductId = true;
            this.formEdit(response);
          },
          error => {
            console.log(error);
          }
        )
      );
    }
  }

  formAdd(): void {
    this.addForm = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });
  }

  formEdit(value: Finance): void {
    this.addForm = this.fb.group({
      id: [
        value.id,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        value.name,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        value.description,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [value.logo, Validators.required],
      date_release: [
        dayjs(value.date_release).format('YYYY-MM-DD'),
        Validators.required,
      ],
      date_revision: [
        dayjs(value.date_revision).format('YYYY-MM-DD'),
        Validators.required,
      ],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onChangeDate(event: Event) {
    const fecha = this.addForm.get('date_release')?.value;
    const fechaActual = dayjs().format('YYYY-MM-DD');

    if (fecha >= fechaActual) {
      const dateRevision = dayjs(fecha).add(1, 'year').format('YYYY-MM-DD');
      this.addForm.get('date_revision')?.setValue(dateRevision);
    } else {
      //this.addForm.get('date_release')?.touched;
      this.addForm.get('date_release')?.setErrors({ required: true });
      this.addForm.get('date_revision')?.setErrors({ required: true });
    }
  }

  reset(): void {
    this.addForm.reset();
  }

  save() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      //this.addForm.controls['id'].errors;
      //this.addForm.get('id')?.invalid;
      this.addForm.controls['id'].touched;
      this.addForm.get('id')?.markAsTouched;
      return;
    } else {
      if (!this.productId) {
        this.createdNewProduct();
      } else {
        this.updateProduct();
      }
    }
  }

  createdNewProduct(): void {
    this.subscription.add(
      this.financeService
        .createdNewProductFinance(this.addForm.value)
        .subscribe(
          response => {
            this.addForm.reset();
          },
          error => {
            console.log(error);
          }
        )
    );
  }

  updateProduct(): void {
    this.subscription.add(
      this.financeService.updateProductFinance(this.addForm.value).subscribe(
        response => {
          this.addForm.reset();
        },
        error => {
          console.log(error);
        }
      )
    );
  }
}
