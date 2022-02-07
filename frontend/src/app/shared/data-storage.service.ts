import { Injectable } from "@angular/core";
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {map, tap, take, exhaustMap} from 'rxjs';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import { RecipeItemComponent } from "../recipes/recipe-list/recipe-item/recipe-item.component";
import {AuthService} from '../auth/auth.service';
import {environment} from '../../environments/environment';
import {User} from './user.model';

@Injectable({providedIn: 'root'})
export class DataStorageService{
    selectedUser:User={
        fullName: '',
        email: '',
        password: ''
    };

    noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService){ }

    storeRecipes(){
        const recipes= this.recipeService.getRecipes();
        this.http
        .put('https://ng-recipe-book-bf6c7-default-rtdb.firebaseio.com/recipes.json',recipes)
        .subscribe(response=>{
            console.log(response);
        })
    }

    fetchRecipes(){
            return this.http.get<Recipe[]>('https://ng-recipe-book-bf6c7-default-rtdb.firebaseio.com/recipes.json')
            .pipe(
                map(recipes=>{
                    return recipes.map(recipe =>{
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        }
                    })
                }),
                tap(recipes =>{
                    this.recipeService.setRecipes(recipes);
                })
            )
    }

    postUser(user: User){
        return this.http.post(environment.apiBaseUrl+'/register',user, this.noAuthHeader);
    }

    login(authCredentials){
        return this.http.post(environment.apiBaseUrl+'/authenticate',authCredentials, this.noAuthHeader);
    }

    getUserProfile(){
        return this.http.get(environment.apiBaseUrl+'/userProfile');
    }

    //Helper methods
    setToken(token: string){
        localStorage.setItem('token', token);
    }

    getToken(){
        return localStorage.getItem('token');
    }

    deleteToken(){
        localStorage.removeItem('token');
    }

    getUserPayload() {
        var token = this.getToken();
        if (token) {
          var userPayload = atob(token.split('.')[1]);
          return JSON.parse(userPayload);
        }
        else
          return null;
      }
    
      isLoggedIn() {
        var userPayload = this.getUserPayload();
        if (userPayload)
          return userPayload.exp > Date.now() / 1000;
        else
          return false;
      }
}