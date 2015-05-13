/// <reference path="../references.d.ts" />

describe('Testing TodoList TemplateControl to', () => {
	var control: app.TodoListControl,
		defaultTodos: Array<ITodo>;

	beforeEach(() => {
		control = plat.acquire(app.TodoListControl);
		defaultTodos = [
			{ label: 'Taste JavaScript', completed: true },
			{ label: 'Buy a unicorn', completed: false }
		];
		
		control.context = {
			todos: defaultTodos,
			allCompleted: false
		}
	});

	describe('make sure', () => {
		it('toggleAll toggles all the todos completed', () => {
			control.context.allCompleted = false;

			control.toggleAll(defaultTodos);
			expect(control.context.allCompleted).toBe(true);
			expect(defaultTodos.map(todo => todo.completed)).toEqual([true, true]);
		});
		
		it('toggle toggles a todo completed', () => {
			var todo: ITodo = defaultTodos[0],
				completed = todo.completed;

			control.toggle(todo);
			expect(todo.completed).toBe(!completed);
		});
		
		it('edit sets editing on a todo to true', () => {
			var todo: ITodo = defaultTodos[0];
			todo.editing = false;

			control.edit(todo);
			expect(todo.editing).toBe(true);
		});
		
		it('save sets editing to on a todo to false', () => {
			var todo: ITodo = defaultTodos[0];
			todo.editing = true;

			control.save(todo);
			expect(todo.editing).toBe(false);
		});
		
		it('cancel resets todo values', () => {
			var todo: ITodo = defaultTodos[0],
				label = todo.label;

			todo.completed = false;
			todo.editing = false;

			control.edit(todo);

			todo.label = label + 'foo';
			todo.completed = true;
			
			control.cancel(todo);
			expect(todo.completed).toBe(false);
			expect(todo.editing).toBe(false);
			expect(todo.label).toBe(label);
		});
		
		it('destroy removes a todo from the list', () => {
			var todo: ITodo = control.context.todos[0];
			control.destroy(0);
			expect(control.context.todos[0]).not.toEqual(todo);
		});
		
		it('destroy removes a todo from the list', () => {
			var todo: ITodo = control.context.todos[0];

			control.destroy(0);
			expect(control.context.todos[0]).not.toEqual(todo);
		});
		
		describe('view returns', () => {
			it('"editing" when passed in true, true | false', () => {
				expect(control.view(true, true)).toBe('editing');
				expect(control.view(true, false)).toBe('editing');
			});

			it('"completed" when passed in false, true', () => {
				expect(control.view(false, true)).toBe('completed');
			});

			it('undefined when passed in false, false', () => {
				expect(control.view(false, false)).toBeUndefined();
			});
		});
	});
});
