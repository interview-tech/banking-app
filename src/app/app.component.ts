import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ClientsComponent } from './clients/clients.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedService } from './shared.service';
import { HttpErrorHandler } from './log-error-handling/http-error-handler.service';
import { MessageService } from './log-error-handling/message.service';
import { Client } from './interface/client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ClientsComponent,
    AsyncPipe,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HighchartsChartModule,
    TranslateModule,
    MatSelectModule,
  ],
  providers: [SharedService, HttpErrorHandler, MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  myControl = new FormControl('');
  options: Client[] = [];
  filteredOptions!: Observable<Client[]>;

  constructor(
    private sharedService: SharedService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadLanguage();
    this.getClients();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): Client[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.firstname
        ? option.firstname.toLowerCase().includes(filterValue)
        : false
    );
  }

  getClients(): void {
    this.sharedService.getClients().subscribe((data: Client[]) => {
      this.options = data;
      this.myControl.setValue('');
    });
  }

  loadLanguage(): void {
    this.translate.addLangs(['en', 'fr', 'hi', 'zh-sg']);
    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang();
    if (browserLang) {
      this.translate.use(
        browserLang.match(/en|fr|hi|zh-sg/) ? browserLang : 'en'
      );
    } else {
      // Fallback to a default language if browser language is not available
      this.translate.use('en');
    }
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}
