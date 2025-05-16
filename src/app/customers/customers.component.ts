import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../service/customer.service';
import { Customer } from '../model/customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers$!: Observable<Array<Customer>>;
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
        return throwError(() => err);
      })
    );
  }

  handleDeleteCustomer(c: Customer) {
    let conf = confirm("Are you sure?");
    if (!conf) return;

    this.customerService.deleteCustomer(c.id).subscribe({
      next: () => {
        this.customers$ = this.customers$.pipe(
          map(data => data.filter(cust => cust.id !== c.id)))
      },
      error: err => {
        console.log(err);
      }
    });
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("/customer-accounts/" + customer.id, { state: customer });
  }
}
