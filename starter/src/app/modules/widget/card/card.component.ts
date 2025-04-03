import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-card',
  imports: [CommonModule,MatTabsModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() data: any[] = [];
  @Input() total: any;

  @Output() cardClick = new EventEmitter<string>(); // ✅ evento verso il padre

  onCardClick(type: string): void {
    this.cardClick.emit(type); // ✅ invia il valore cliccato
  }

}
