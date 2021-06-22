import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { BackendService } from '../backend.service';
import { Card } from '../card';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


const REGEXP_WIKI_URL: RegExp = /^https:\/\/(en|ja|fr).wikipedia.org\/wiki\/.+$/;
const URL: RegExp = /^https?:\/\/\S+.[^d]+.*$/;

@Injectable({providedIn:'root'})
@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {
  addCardForm = this.formBuilder.group({
    person: this.formBuilder.group({
      en: new FormControl(undefined),
      fr: new FormControl(undefined),
      ja: new FormControl(undefined),
    }),
    wikipedia: this.formBuilder.group({
      en: new FormControl(undefined, [Validators.pattern(REGEXP_WIKI_URL)]),
      fr: new FormControl(undefined, [Validators.pattern(REGEXP_WIKI_URL)]),
      ja: new FormControl(undefined, [Validators.pattern(REGEXP_WIKI_URL)]),
    }),
    imageUrl: new FormControl(undefined, [Validators.pattern(URL)]),
    inputLang: new FormControl(undefined), // default FR
    difficulty: new FormControl('medium', [Validators.required])
  });

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    let card : Card = new Card();
    card.copyFrom(this.addCardForm.value);

    this.backendService.AddCard(card).subscribe(res => {
      this.addCardForm.controls['wikipedia'].reset();
      this.addCardForm.controls['person'].reset();
      this.addCardForm.controls['imageUrl'].reset();
    })
  }

  loadAndSubmit(): void {
    const checkAndSubmit = () : boolean => {
      let card : Card = new Card();
      card.copyFrom(this.addCardForm.value);
      
      // Beware that if a field is invalid, the preload process will overwrite it
      if (card.isInputReady() && this.addCardForm.valid) {
        this.onSubmit();
        return true
      }
      return false
    }

    if (!checkAndSubmit()) {
      this.preloadCard().pipe(
        map(() => {
          return checkAndSubmit()
        })
      ).subscribe(inputReady => {
        if (!inputReady) {
          this.matSnackBar.open(`Fields are missing or invalid.`, 'Close', {duration: 2000});
        }
      })
    }
  }

  load() {
    this.preloadCard().subscribe()
  }

  private preloadCard(): Observable<void> {
    let card : Card = new Card();
    card.copyFrom(this.addCardForm.value);

    return this.backendService.PreloadCard(card).pipe(
      map((card: Card) => {
        this.addCardForm.patchValue(card)
      })
    )
  }

}
