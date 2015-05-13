/// <reference path="../references.d.ts" />

module mock {
	class Repository extends app.TodoRepository {
		pull() {
			return this.Promise.resolve([
				{ label: 'Taste JavaScript', completed: true },
				{ label: 'Buy a unicorn', completed: false }
			]);
		}
		
		push(todos: Array<ITodo>) {
			return this.Promise.resolve();
		}
	}
	
	export module repository {
		export function on() {
			plat.register.injectable('todo-repo', Repository, [
				plat.storage.LocalStorage,
				plat.async.IPromise,
				plat.Utils
			]);
		}
		
		export function off() {
			plat.register.injectable('todo-repo', app.TodoRepository, [
				plat.storage.LocalStorage,
				plat.async.IPromise,
				plat.Utils
			]);
		}
	}
}
