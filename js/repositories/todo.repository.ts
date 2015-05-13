/// <reference path="../references.d.ts" />

module app {
	'use strict';

	export class TodoRepository {
		constructor(protected storage: plat.storage.LocalStorage, 
					protected Promise: plat.async.IPromise,
					protected utils: plat.Utils) { }
		
		pull(): plat.async.IThenable<Array<ITodo>> {
			var todosString: string = this.storage.getItem<string>('todos-platypusts');
			
			if(this.utils.isEmpty(todosString)) {
				return this.Promise.resolve([]);
			}
			
			return this.Promise.resolve(JSON.parse(todosString));
		}
		
		push(todos: Array<ITodo>): plat.async.IThenable<void> {
			return this.Promise.resolve(this.storage.setItem('todos-platypusts', JSON.stringify(todos.map((todo) => {
				return <ITodo>{
					label: todo.label,
					completed: todo.completed
				};
			}))));
		}
	}
	
	plat.register.injectable('todo-repo', TodoRepository, [
		plat.storage.LocalStorage,
		plat.async.IPromise,
		plat.Utils
	]);
}
