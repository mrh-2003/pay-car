import { Component, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private elementRef: ElementRef,
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router) { }
  front_box: any;
  form_login: any;
  form_register: any;
  back_box_login: any;
  back_box_register: any;

  form !: FormGroup

  ngOnInit() {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      }
    )
  }

  register() {
    this.loginService.register(this.form.value)
      .then(
        () => {
          this.changeLogin()
        }
      )
      .catch(error => console.log(error));
  }

  login() {
    this.loginService.login(this.form.value)
      .then(
        response => this.router.navigate(["home"])
      )
      .catch(error => console.log(error));
  }


  loginGoogle() {
    this.loginService.loginGoogle()
      .then(
        response => this.router.navigate(["home"])
      )
      .catch(error => console.log(error));
  }

  loginFacebook() {
    this.loginService.loginGoogle()
      .then(
        response => this.router.navigate(["home"])
      )
      .catch(error => console.log(error));
  }

  ngAfterViewInit() {
    this.front_box = this.elementRef.nativeElement.querySelector(".front_box");
    this.form_login = this.elementRef.nativeElement.querySelector(".form_login");
    this.form_register = this.elementRef.nativeElement.querySelector(".form_register");
    this.back_box_login = this.elementRef.nativeElement.querySelector(".back_box_login");
    this.back_box_register = this.elementRef.nativeElement.querySelector(".back_box_register");
    this.withPage();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.withPage(); // Llama a la función que deseas ejecutar en cada redimensionamiento
  }

  withPage() {
    this.back_box_register.style.display = "block";
    if (window.innerWidth > 850) {
      this.back_box_login.style.display = "block";
    } else {
      this.back_box_register.style.opacity = "1";
      this.back_box_login.style.display = "none";
      this.form_login.style.display = "block";
      this.form_register.style.display = "none";
      this.front_box.style.left = "0px";
    }

  }

  changeLogin() {
    if (window.innerWidth > 850) {
      this.form_register.style.display = "none";
      this.front_box.style.left = "10px"
      this.form_login.style.display = "block";
      this.back_box_register.style.opacity = "1";
      this.back_box_login.style.opacity = "0";
    } else {
      this.form_register.style.display = "none";
      this.front_box.style.left = "0px"
      this.form_login.style.display = "block";
      this.back_box_register.style.display = "block";
      this.back_box_login.style.display = "none";
    }

  }

  changeRegister() {
    if (window.innerWidth > 850) {
      this.form_register.style.display = "block";
      this.front_box.style.left = "410px"
      this.form_login.style.display = "none";
      this.back_box_register.style.opacity = "0";
      this.back_box_login.style.opacity = "1";
    } else {
      this.form_register.style.display = "block";
      this.front_box.style.left = "0px"
      this.form_login.style.display = "none";
      this.back_box_register.style.display = "none";
      this.back_box_login.style.display = "block";
      this.back_box_login.style.opacity = "1";
    }
  }
}
