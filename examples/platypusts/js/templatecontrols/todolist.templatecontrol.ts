/// <reference path="../references.d.ts" />

module app {
	'use strict';

	export class TodoListControl extends plat.ui.TemplateControl {		
		templateUrl = '/js/templatecontrols/todolist.templatecontrol.html';
		replaceWith = 'section';

		context: {
			todos: Array<ITodo>;
			allCompleted: boolean;
		};

		options: plat.observable.IObservableProperty<{ context: IFilterAndRefresh; }>;

		todoClone: ITodo;

		toggleAll(todos: Array<ITodo>) {
			var complete = this.context.allCompleted = !this.context.allCompleted;
			
			this.utils.forEach((todo) => {
				todo.completed = complete;
			}, todos);
			
			this.refresh();
		}

		toggle(todo: ITodo) {
			todo.completed = !todo.completed;
			this.refresh();
		}

		edit(todo: ITodo) {
			this.todoClone = this.utils.clone(todo);
			todo.editing = true;
		}

		save(todo: ITodo) {
			this.todoClone = undefined;
			
			todo.editing = false;
		}

		cancel(todo: ITodo) {
			var clone = this.todoClone;

			todo.label = clone.label;
			todo.completed = clone.completed;
			todo.editing = false;
		}

		destroy(index: number) {
			this.context.todos.splice(index, 1);
			this.refresh();
		}

		view(editing: boolean, completed: boolean) {
			if(editing) {
				return 'editing';
			}

			if(completed) {
				return 'completed';
			}
		}

		protected show(completed: boolean) {
			return this.getContext().show(completed);
		}

		protected getContext(): IFilterAndRefresh {
			return this.options.value.context;
		}

		protected refresh() {
			this.getContext().refresh(this.context.todos);
		}
	}

	plat.register.control('todo-list', TodoListControl);
}
