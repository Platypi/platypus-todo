/// <reference path="../references.d.ts" />

class MockTodoListControl extends app.TodoListControl {
	protected getContext(): IFilterAndRefresh {
		return {
			show(completed: boolean) { return completed; },
			refresh() { }
		};
	}
}

plat.register.control('todo-list', MockTodoListControl);
