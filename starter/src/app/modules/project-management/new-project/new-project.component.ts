import { Component, inject, signal, computed } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { map, Observable, startWith } from 'rxjs';
import { members } from 'app/mock-api/apps/scrumboard/data';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ProjectManagementService } from '../project-management.service';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';
import { Card } from '../project-management.models';
@Component({
  selector: 'app-new-project',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule
  ],

  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {

  constructor(private projectManagementService: ProjectManagementService){}

  separatorKeysCodes: number[] = [ENTER, COMMA];
  peopleCtrl = new FormControl('');
  filteredPeople$: Observable<string[]>;
  allPeople: string[] = [];

  formFieldHelpers: string[] = [''];
  personCtrl = new FormControl('');


  // Elenco statico
  //users = ['Mario Rossi', 'Giulia Verdi', 'Luca Bianchi', 'Alessia Neri'];
  filteredUsers!: Observable<string[]>;


  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<NewProjectComponent>);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],  // 👈 serve stringa vuota come default!
    description: [''],
    isPublic: [false],
    people: [[]]
  });

  get isPublic() {
    return this.form.get('isPublic')?.value;
  }

  ngOnInit(): void {
    this.allPeople = members.map(m => m.name); // modifica se hai { name, image, id, etc. }
    this.filteredPeople$ = this.peopleCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPeople(value || ''))
    );
  }

  // private _filterUsers(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   const alreadyAdded = this.form.get('people')?.value || [];
  //   return this.users.filter(user =>
  //     user.toLowerCase().includes(filterValue) && !alreadyAdded.includes(user)
  //   );
  // }

  private _filterPeople(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allPeople.filter(
      person =>
        person.toLowerCase().includes(filterValue) &&
        !this.form.get('people')?.value.includes(person)
    );
  }

  save(): void {
    const values = this.form.value;
  
    // Mappa i nomi ai rispettivi ID
    const selectedMembers = values.people.map((name: string) => {
      const match = members.find(m => m.name === name);
      return match?.id;
    }).filter(Boolean); // Rimuove eventuali undefined
  
    const newProject = {
      id: uuid(),
      title: values.name,
      description: values.description,
      icon: 'heroicons_outline:folder',
      lastActivity: DateTime.now().startOf('day').minus({ days: 1 }).toISO(),
      members: values.people.map((name: string) => {
        const match = members.find(m => m.name === name);
        return {
          id: match?.id,
          avatar: match?.avatar ?? 'assets/avatars/default.jpg'
        };
      }).filter(Boolean),
      lists: [],
      labels: [] // 👈 AGGIUNGI QUESTO
    };
    
    
    
  
    console.log('✅ Progetto creato:', newProject);
    this.projectManagementService.addProject(newProject); // modifica solo dati locali
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  toggleVisibility(): void {
    const current = this.form.get('isPublic')?.value;
    this.form.get('isPublic')?.setValue(!current);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // addPerson(value: string): void {
  //   const person = value?.trim();
  //   if (!person) return;

  //   const current = this.form.get('people')?.value || [];

  //   if (!current.includes(person)) {
  //     this.form.get('people')?.setValue([...current, person]);
  //   }
  // }

  // removePerson(person: string): void {
  //   const current = this.form.get('people')?.value || [];
  //   this.form.get('people')?.setValue(current.filter(p => p !== person));
  // }

  handleManualEntry(): void {
    const person = this.personCtrl.value?.trim();
    if (person) {
      this.addPerson(person);
    }
  }

  addPerson(name: string): void {
    name = (name || '').trim();
    if (!name) return;

    const current = this.form.get('people')?.value || [];
    if (!current.includes(name)) {
      this.form.get('people')?.setValue([...current, name]);
    }
    this.peopleCtrl.setValue('');
  }

  removePerson(name: string): void {
    const current = this.form.get('people')?.value || [];
    this.form.get('people')?.setValue(current.filter(p => p !== name));
  }

  displayedAvatars(): string[] {
    return this.form.get('people')?.value?.slice(0, 5) || [];
  }



  getColorFor(name: string): string {
    const colors = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }


}
