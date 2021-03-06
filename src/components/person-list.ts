import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
    selector: 'person-list',
    template: (
      `
        <ul>
          <li
            *ngFor='let person of listFilter(people)'
            [class.attending]='person.attending'
          >
             {{person.name}} - Guests: {{person.guests}}
             <button (click)='addGuest.emit(person)'>+</button>
             <button *ngIf='person.guests' (click)='removeGuest.emit(person)'>-</button>
             Attending?
             <input type='checkbox' [checked]='person.attending' (change)='toggleAttending.emit(person)' />
             <button (click)='removePerson.emit(person)'>Delete</button>
          </li>
        </ul>
      `
    )
})
export class PersonList {
    @Input() people;
    @Input() filter;
    @Output() addGuest = new EventEmitter();
    @Output() removeGuest = new EventEmitter();
    @Output() removePerson = new EventEmitter();
    @Output() toggleAttending = new EventEmitter();

    listFilter(list){
        switch(this.filter){
            case 'SHOW_ATTENDING':
                return list.filter(person => person.attending);
            case 'SHOW_WITH_GUESTS':
                return list.filter(person => person.guests > 0);
            default:
                return list;
        }
    }
}
