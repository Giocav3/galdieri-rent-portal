import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-stakeholder-form',
  templateUrl: './stakeholder-form.component.html',
  styleUrls: ['./stakeholder-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class StakeholderFormComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  form!: FormGroup;
  showPersonalDataDetails = false;
  showCompanyDataDetails = false;

  stakeholderTypes = ['Cliente', 'Fornitore', 'Dipendente', 'Utilizzatore'];
  personaTypes = [
    'Ditta individuale', 'Libero professionista', 'Società di persone',
    'Società di capitali', 'Associazione non riconosciuta', 'Associazione studi associati',
    'Socio d\'azienda', 'Persona fisica'
  ];

  personalDataMock = [
    { 
     name: "Danilo",
     surname: "Nitti",
     fiscalCode: "ixipnu10n48o191K",
     email: "ngiradello@natta-scamarcio.com",
     phone: "+39 84 9827125",
     gender: "M",
     birthday: "1978-05-14",
     birthPlace: "Arturo calabro",
     birthCounty: "FE",
     title: "Sig.",
     address: "Contrada Enzio",
     cap: "13622",
     province: "RG",
     common: "Fiorucci calabro",
     region: "Liguria",
     houseNumber: "9",
     latitude: 72.177022,
     longitude: 156.839806
 }
 ];
   
   companyDataMock = [
     {
       companyName: "Dandolo, Marini e Badoglio Group",
       vatNumber: "IT67607616199",
       phone: "+39 69 0230788",
       email: "caterina22@sonnino.com",
       region: "Emilia-Romagna",
       province: "NO",
       common: "Cabrini veneto",
       cap: "03167",
       houseNumber: "04",
       address: "Via Ninetta",
       latitude: -86.12991,
       longitude: 107.320166,
       pec: "michelotto83@vodafone.it",
       sdiCode: "cfx3369"
     }
   ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      stakeholderType: [null, Validators.required],
      type: [null, Validators.required],
      personalData: this.fb.group({
        fiscalCode: ['', Validators.required],
        name: [''], surname: [''], email: [''], phone: [''], gender: [''], birthday: [''],
        birthPlace: [''], birthCounty: [''], title: [''], address: [''], cap: [''],
        province: [''], common: [''], region: [''], houseNumber: [''],
        latitude: [''], longitude: ['']
      }),
      companyData: this.fb.group({
        vatNumber: [''], companyName: [''], email: [''], phone: [''],
        region: [''], province: [''], common: [''], cap: [''], houseNumber: [''],
        address: [''], latitude: [''], longitude: [''], pec: [''], sdiCode: ['']
      }),
      userDetails: this.fb.group({})
    });

    this.form.get('stakeholderType')?.valueChanges.subscribe(type => {
      this.updateUserDetailsForm(type);
    });
  }

  isPersonaFisica(): boolean {
    const type = this.form.get('type')?.value;
    return type === 'Persona fisica' || type === 'Socio d\'azienda';
  }

  onFiscalCodeBlur(): void {
    const cf = this.form.get('personalData.fiscalCode')?.value?.toLowerCase();
    const match = this.personalDataMock.find(p => p.fiscalCode.toLowerCase() === cf);
    if (match) {
      this.form.get('personalData')?.patchValue(match);
      this.showPersonalDataDetails = true;
    } else {
      this.showPersonalDataDetails = false;
    }
  }

  onVatNumberBlur(): void {
    const vat = this.form.get('companyData.vatNumber')?.value;
    const match = this.companyDataMock.find(c => c.vatNumber === vat);
    if (match) {
      this.form.get('companyData')?.patchValue(match);
      this.showCompanyDataDetails = true;
    } else {
      this.showCompanyDataDetails = false;
    }
  }

  private updateUserDetailsForm(type: string): void {
    const userDetailsForm = this.fb.group({});
    switch (type) {
      case 'Cliente':
        userDetailsForm.addControl('iban', this.fb.control('', Validators.required));
        userDetailsForm.addControl('clientCode', this.fb.control('', Validators.required));
        userDetailsForm.addControl('origin', this.fb.control('', Validators.required));
        userDetailsForm.addControl('businessSector', this.fb.control('', Validators.required));
        userDetailsForm.addControl('clientType', this.fb.control('', Validators.required));
        userDetailsForm.addControl('agreement', this.fb.control('', Validators.required));
        userDetailsForm.addControl('associatedConsultant', this.fb.control('', Validators.required));
        userDetailsForm.addControl('documents', this.fb.control('', Validators.required));
        userDetailsForm.addControl('sdiCode', this.fb.control('', Validators.required));
        userDetailsForm.addControl('practices', this.fb.control('', Validators.required));
        break;
      case 'Fornitore':
        userDetailsForm.addControl('paymentMethod', this.fb.control('', Validators.required));
        break;
      case 'Dipendente':
        userDetailsForm.addControl('role', this.fb.control('', Validators.required));
        userDetailsForm.addControl('reference', this.fb.control('', Validators.required));
        break;
      case 'Utilizzatore':
        userDetailsForm.addControl('reference', this.fb.control('', Validators.required));
        break;
    }
    this.form.setControl('userDetails', userDetailsForm);
  }

  resetForm(): void {
    this.initForm();
    this.stepper.reset();
    this.showPersonalDataDetails = false;
    this.showCompanyDataDetails = false;
  }
}
