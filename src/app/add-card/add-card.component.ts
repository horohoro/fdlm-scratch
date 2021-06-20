import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { BackendService } from '../backend.service';
import { Card } from '../card';

const REGEXP_WIKI_URL = /https:\/\/(en|ja|fr).wikipedia.org\/wiki\/[^\\]+/;

@Injectable({providedIn:'root'})
@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {
  addCardForm = this.formBuilder.group({
    person: new FormControl(undefined),
    wikipedia: new FormControl(undefined, [Validators.pattern(REGEXP_WIKI_URL)]),
    inputLang: new FormControl('fr', [Validators.required]), // default FR
    difficulty: new FormControl('medium'),
  });

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    let card = new Card();
    card.inputLang = this.addCardForm.value.inputLang;
    if (this.addCardForm.value.person) {
      card.setPerson(this.addCardForm.value.person, this.addCardForm.value.inputLang);
    }
    if (this.addCardForm.value.wikipedia) {
      card.setWikipedia(this.addCardForm.value.wikipedia, this.addCardForm.value.inputLang);
    }
    if (this.addCardForm.value.difficulty) {
      card.difficulty = this.addCardForm.value.difficulty
    }
    this.backendService.AddCard(card).subscribe(res => {  
      this.addCardForm.controls['person'].reset();
      this.addCardForm.controls['wikipedia'].reset();
    });
  }

}
