// Load Global Styles First
import './style.css';

import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

// External Components
import { PersonList } from './components/person-list';
import { PersonInput } from './components/person-input';
import { FilterSelect } from './components/filter-select';

// RXJS Observable
import { Observable } from 'rxjs/Observable';

import { Store, provideStore } from '@ngrx/store';

import { people } from './reducers/people';
import { filter } from './reducers/filter';

@Component({
	selector: 'app',
	template: (
    `
      <h3>Party Planner</h3>
      <filter-select (updateFilter)='updateFilter($event)'></filter-select>
      <person-input (addPerson)='addPerson($event)'></person-input>
      <person-list
        [people]='people | async'
        (addGuest)='addGuest($event)'
        (removeGuest)='removeGuest($event)'
        (removePerson)='removePerson($event)'
        (toggleAttending)='toggleAttending($event)'>
      </person-list>
    `
  ),
	directives: [PersonList, PersonInput, FilterSelect]
})
export class App {
	public people;
	private id = 0;

	constructor(
		private _store: Store<any>
	) {
		this.people = Observable.combineLatest(
			_store.select('people'),
			_store.select('filter'),
			(people, filter) => {
				return people.filter(filter)
			}
		)
	}

	addPerson(name){
		this._store.dispatch({
			type: 'ADD_PERSON',
			payload: {
				id: ++this.id,
				name,
				guests: 0,
				attending: false
			}
		})
	}

	addGuest({id}){
		this._store.dispatch({
			type: 'ADD_GUESTS',
			payload: id
		})
	}

	removeGuest({id}){
		this._store.dispatch({
			type: 'REMOVE_GUESTS',
			payload: id
		})
	}

	removePerson({id}){
		this._store.dispatch({
			type: 'REMOVE_PERSON',
			payload: id
		})
	}

	toggleAttending({id}){
		this._store.dispatch({
			type: 'TOGGLE_ATTENDING',
			payload: id
		})
	}

	updateFilter(filter){
		this._store.dispatch({type: filter});
	}
}

bootstrap(App, [
	provideStore({ people, filter })
]);
