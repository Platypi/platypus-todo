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
			todos: <Array<ITodo>>undefined,
			allCompleted: false,
			completedCount: 0,
			remainingCount: 0,
			newTodo: '',
			status: ''
		};
		
		constructor(protected repository: TodoRepository) {
			super();
		}
		
		setTemplate() {
			this.dom.addClass(this.element, 'todoapp');
		}
		
		navigatedTo(parameters: { status?: string; }) {
			this.context.status = parameters.status;
			this.repository.pull().then((todos) => {
				this.refresh(todos);
				this.context.todos = todos;
			});
		}
		
		create(todo: string) {
			todo = todo.trim();
			if(this.utils.isEmpty(todo)) {
				return;
			}

			var todos: Array<ITodo> = this.context.todos;

			todos.push({
				label: todo,
				completed: false
			});
			this.context.newTodo = '';
			this.refresh(todos);
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
			this.repository.push(todos);
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
			todos = this.utils.filter((todo) => {
				return !todo.completed;
			}, todos);
			this.refresh(todos);
			this.context.todos = todos;
		}
	}
	
	plat.register.viewControl('todo-vc', TodoControl, [
		TodoRepository
	]);
}
