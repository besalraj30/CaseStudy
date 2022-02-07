import { Component, OnInit } from "@angular/core";
import {NgForm} from '@angular/forms';
import {AuthService, AuthResponseData} from './auth.service';
import {Observable} from 'rxjs';
import { Router } from "@angular/router";
import {DataStorageService} from '../shared/data-storage.service'; 
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    providers: [DataStorageService]
})
export class AuthComponent implements OnInit{
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    showSuccessMessage: boolean;
    serverErrorMessage: string;
    isLoginMode=true;
    isLoading=false;
    error:string=null;
    constructor(private authService: AuthService, private router: Router, private dataStorageService: DataStorageService){}
    onSwitchMode(){
        this.isLoginMode=!this.isLoginMode;
    }

    // onSubmit(form: NgForm){
    //    if(!form.valid){
    //        return;
    //    }
    //    const email=form.value.email;
    //    const password=form.value.password;
    //    let authObs: Observable<AuthResponseData>;
    //    this.isLoading=true;
    //    if(this.isLoginMode){
    //        authObs= this.authService.login(email,password);
    //    }
    //    else{
    //     authObs=this.authService.signup(email,password);
    //    }
    //    authObs.subscribe(
    //     resData=>{
    //         console.log(resData);
    //         this.isLoading=false;
    //         this.router.navigate(['/recipes']);
    //     },
    //     errorMessage=>{
    //         console.log(errorMessage);
    //         this.error=errorMessage;
    //         this.isLoading=false;
    //     }
    // );

    //     form.reset();
    // }

    onSubmit(form: NgForm){
        if(!this.isLoginMode)
        {
            this.dataStorageService.login(form.value).subscribe(
                res=>{
                    this.dataStorageService.setToken(res['token']);
                    this.router.navigateByUrl('/recipes');
                },
                err=>{
                    this.serverErrorMessage=err.error.message;
                }
            )
        }
        else
        {
            this.dataStorageService.postUser(form.value).subscribe(
                res =>{
                    this.showSuccessMessage=true;
                    setTimeout(()=> this.showSuccessMessage=false,4000);
                    this.resetForm(form);
                },
                err=>{
                    if(err.status===422){
                        this.serverErrorMessage=err.error.join('<br />');
                    }else{
                        this.serverErrorMessage='Something went wrong. PLease contact admin';
                    }
                }
            );
        }
    }

    resetForm(form:NgForm){
        this.dataStorageService.selectedUser={
            fullName: '',
            email: '',
            password: ''
        };
        form.resetForm();
        this.serverErrorMessage="";
    }
    ngOnInit(){

    }
}