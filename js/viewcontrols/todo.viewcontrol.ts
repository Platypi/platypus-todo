/// <reference path="../../references.d.ts" />

module app {
	'use strict';
	var todos: Array<ITodo> = [
		{ label: 'Taste JavaScript', completed: true },
		{ label: 'Buy a unicorn', completed: false }
	];

	export class TodoControl extends plat.ui.ViewControl implements IFilterAndRefresh {		
		templateUrl = '/js/viewcontrols/todo.viewcontrol.html';
		replaceWith = 'section';

		context = {
			todos: <Array<ITodo>>todos,
			allCompleted: false,
			completedCount: 0,
			remainingCount: 0,
			newTodo: '',
			status: ''
		};
		
		setTemplate() {
			this.dom.addClass(this.element, 'todoapp');
		}
		
		navigatedTo(parameters: { status?: string; }) {
			this.context.status = parameters.status;
			
			this.refresh(this.context.todos);
		}
		
		create(todo: string) {
			todo = todo.trim();
			if(this.utils.isEmpty(todo)) {
				return;
			}

			this.context.todos.push({
				label: todo,
				completed: false
			});
			this.context.newTodo = '';
		}
		
		refresh(todos: Array<ITodo>) {
			var completed = 0;
			var remaining = 0;
			var context = this.context;

			this.utils.forEach((todo) => {
				if(todo.completed) {
					completed += 1;
				} else {
					remaining += 1;
				}
			}, todos);
			
			context.allCompleted = remaining === 0;
			context.completedCount = completed;
			context.remainingCount = remaining;
		}
		
		show(completed: boolean): boolean {
			switch(this.context.status) {
				case 'active':
					return !completed;
				case 'completed':
					return completed;
				default:
					return true;
			}
		}

		clear(todos: Array<ITodo>) {
			this.context.todos = this.utils.filter((todo) => {
				return !todo.completed;
			}, todos);
			this.refresh(todos);
		}
	}
	
	plat.register.viewControl('todo-vc', TodoControl);
}
