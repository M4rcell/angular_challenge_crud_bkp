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

  products: Finance[] = [];
  pageSize = 5;
  currentPage = 1;

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
        let preFilter: Finance[] = [];
        preFilterSearch = products.filter((finance: Finance) => {
          return (
            String(finance.name).toLowerCase().includes(searchTerm) ||
            String(finance.description).toLowerCase().includes(searchTerm)
          );
        });
        this.products = preFilterSearch;
        return (preFilter = preFilterSearch);
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
          //this.getAllProductFinance();
        },
        error => {
          console.log(error);
        }
      )
    );
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.products.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.products.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
