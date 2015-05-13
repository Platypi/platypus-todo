/// <reference path="../references.d.ts" />

describe('Testing Todo ViewControl to', () => {
	var control: app.TodoControl;

	beforeEach((done) => {
		mock.repository.on();
		control = plat.acquire(app.TodoControl);
		control.navigatedTo({}).then(done);
	});
	
	afterEach(() => {
		mock.repository.off();
	});

	describe('make sure', () => {
		it('create creates a todo', () => {
			var todos = control.context.todos,
				length = todos.length;
			
			control.create('Bar');
			expect(todos.length).toBe(length + 1);
		});
		
		it('create does not create an empty todo', () => {
			var todos = control.context.todos,
				length = todos.length;
			
			control.create('');
			control.create(' ');
			control.create('                     ');
			expect(todos.length).toBe(length);
		});
		
		it('refresh totals completed and remaining todos', () => {
			var todos = control.context.todos;
			todos.forEach(todo => todo.completed = true);
			control.refresh(todos);
			
			expect(control.context.allCompleted).toBe(true);
			expect(control.context.completedCount).toBe(todos.length);
			expect(control.context.remainingCount).toBe(0);

			todos.forEach(todo => todo.completed = false);
			control.refresh(todos);
			
			expect(control.context.allCompleted).toBe(false);
			expect(control.context.completedCount).toBe(0);
			expect(control.context.remainingCount).toBe(todos.length);
		});
		
		describe('show returns', () => {
			it('completed when status is completed', () => {
				control.context.status = 'completed';
				
				expect(control.show(true)).toBe(true);
			});
			
			it('!completed when status is active', () => {
				control.context.status = 'active';
				
				expect(control.show(true)).toBe(false);
			});
			
			it('true by default', () => {
				control.context.status = '';
				
				expect(control.show(true)).toBe(true);
				expect(control.show(false)).toBe(true);
			});
		});
		
		it('clear filters out completed todos', () => {
			var todos = control.context.todos;
			
			todos.forEach(todo => todo.completed = true);
			control.clear(todos);
			expect(control.context.todos).toEqual([]);
		});
	});
});
