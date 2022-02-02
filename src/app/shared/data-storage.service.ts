import { Injectable } from "@angular/core";
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, tap, take, exhaustMap} from 'rxjs';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import { RecipeItemComponent } from "../recipes/recipe-list/recipe-item/recipe-item.component";
import {AuthService} from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService{
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
}