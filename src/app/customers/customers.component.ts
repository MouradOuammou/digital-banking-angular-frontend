import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../service/customer.service';
import { Customer } from '../../model/customer.model';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    AsyncPipe,
    NgForOf,
  ],
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers$!: Observable<Customer[]>;
  errorMessage: string | null = null;
  searchFormGroup: FormGroup;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control("")
    });
  }

  ngOnInit(): void {
    this.handleSearchCustomers();
  }

  handleSearchCustomers() {
    const kw = this.searchFormGroup.value.keyword;
    this.customers$ = this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return of([]);
      })
    );
  }

  handleClearSearch() {
    this.searchFormGroup.reset();
    this.handleSearchCustomers();
  }

  handleNewCustomer() {
    this.router.navigateByUrl("/new-customer").then(() => console.log("Navigated to new customer page"));
  }

  handleEditCustomer(customer: Customer) {
    this.router.navigateByUrl("/edit-customer/" + customer.id).then(r => console.log(r));
  }

  handleDeleteCustomer(c: Customer) {
    let conf = confirm(`Êtes-vous sûr de vouloir supprimer le client "${c.name}" ?`);
    if (!conf) return;

    this.customerService.deleteCustomer(c.id).subscribe({
      next: () => {
        this.customers$ = this.customers$.pipe(
          map(data => data.filter(cust => cust.id !== c.id))
        );
        alert('Client supprimé avec succès');
      },
      error: err => {
        console.log(err);
        alert('Erreur lors de la suppression du client');
      }
    });
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("/customer-accounts/" + customer.id, { state: customer }).then(r => console.log(r));
  }

  trackByCustomerId(_index: number , customer: Customer): number {
    return customer.id;
  }
  refresh() {
    this.handleSearchCustomers();
  }
}
