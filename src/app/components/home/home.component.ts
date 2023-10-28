import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Observable,
  Subscription,
  combineLatest,
  debounceTime,
  filter,
  map,
  startWith,
} from 'rxjs';
import { Finance } from 'src/app/core/models/finance.model';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  showContextMenu = false;

  //productFinanceData: Finance[] = [];

  contextMenuOpen = false;
  selectedItem: any;
  contextMenuStyles: any = {};

  productsFinance$!: Observable<Finance[]>;
  searchControl = new FormControl('');

  constructor(
    private router: Router,
    private financeService: FinanceService
  ) {
    //this.getAllProductFinance();
  }

  ngOnInit(): void {
    this.productsFinance$ = combineLatest(
      this.financeService.getProductFinance(),
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        filter(input => input !== null),
        startWith<any>('')
      )
    ).pipe(
      map(([products, search]) => {
        const searchTerm = search.toLowerCase().trim();
        let preFilterSearch: Finance[] = [...products];
        return (preFilterSearch = products.filter((finance: Finance) => {
          return (
            String(finance.name).toLowerCase().includes(searchTerm) ||
            String(finance.description).toLowerCase().includes(searchTerm)
          );
        }));
      })
    );
  }

  toggleContextMenu(event: Event, item: any) {
    event.preventDefault();
    this.contextMenuOpen = !this.contextMenuOpen;
    this.selectedItem = item;
    const posX = (event as MouseEvent).clientX;
    const posY = (event as MouseEvent).clientY;
    this.contextMenuStyles = {
      top: `${posY}px`,
      left: `${posX}px`,
    };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addNewProduct(): void {
    this.router.navigate(['/agregar']);
  }

  getAllProductFinance() {
    this.subscription.add(
      this.financeService.getProductFinance().subscribe(
        (response: any) => {
          //this.productFinanceData = response;
        },
        error => {
          console.log(error);
        }
      )
    );
  }

  editar(value: Finance) {
    this.financeService.setSharetProductFinance(value);
    const id = value.id;
    this.router.navigate(['/editar', id]);
  }

  eliminar(value: Finance) {
    this.subscription.add(
      this.financeService.deleteProductFinance(value.id).subscribe(
        response => {
          this.getAllProductFinance();
        },
        error => {
          console.log(error);
        }
      )
    );
  }
}
