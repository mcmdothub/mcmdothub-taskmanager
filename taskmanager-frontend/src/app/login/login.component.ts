import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  authService = inject(AuthService);
  errorMessage = '';
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // if the form is valid the authService will trigger the login method
      // we pass in our email & password that we receive from our form
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        // that we need to subscribe to that so that the services will actually trigger the event
        // if something goes wrong, for example an email that does not exist with a password that doesn't exist
        // to fix this we add inside subscribe an object "{}"
        // the first is "next", what I want to happen next
        // if it was "next", then it's something successfull, so i want to clear any error message that exists
        .subscribe({
          next: () => {
            this.errorMessage = '';
          },
          // else if there is an error
          error: (err) => {
            this.errorMessage = err.message;
          },
        });
    } else {
      this.errorMessage = 'Please fill in all the required fields.';
    }
  }
}
