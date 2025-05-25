import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  loginForm: any;
  isLoading: false | undefined;

  constructor(private fb: FormBuilder, private router: Router) { }
    ngOnInit(): void {
      this.formLogin = this.fb.group({
        username: this.fb.control(''),
        password: this.fb.control('')
      })
    }

  onSubmit() {

  }
}
