module app.repositories {
    'use strict';

    export class TodoRepository implements ITodoRepository {
        private id = 'todos-platypits';

        private todos: Array<models.ITodo> = [];

        /**
         * Injectables can inject other injectables!
         */
        constructor(private todoFactory: models.ITodoFactory,
            private storage: plat.storage.ILocalStorage,
            private utils: plat.IUtils) { }

        addTodo(title: string, completed: boolean) {
            this.todos.push(this.__createTodo(title, completed));

            return this.__createTodo(title, completed);
        }

        getTodos(): Array<models.ITodo> {
            this.todos = JSON.parse(this.storage.getItem<string>(this.id) || '[]');

            return this.__createTodos(this.todos);
        }

        setTodos(todos: Array<models.ITodo>) {
            this.todos = this.__createTodos(todos);
            this.storage.setItem(this.id, JSON.stringify(todos));
        }

        private __createTodo(title: string, completed: boolean, id?: string) {
            return this.todoFactory.createInstance(title, completed, id);
        }

        private __createTodos(todos: Array<models.ITodo>) {
            return this.utils.map(todos, (todo) => {
                return this.__createTodo(todo.title, todo.completed, todo.id);
            });
        }
    }

    export interface ITodoRepository {
        /**
         * Adds and returns a new todo.
         * 
         * @param title The title of the todo.
         * @param completed Whether or not the todo is completed.
         */
        addTodo(title: string, completed: boolean): models.ITodo;
        /**
         * Returns the todo list from storage.
         */
        getTodos(): Array<models.ITodo>;

        /**
         * Puts a new todo list into storage.
         */
        setTodos(todos: Array<models.ITodo>): void;
    }

    export var ITodoRepository = TodoRepository;

    /**
     * Here is how you register an injectable. This injectable is registered as 
     * 'storage' and depends on 'plat.localStorage'. If another component wants to 
     * use this injectable, it simply adds 'storage' to its dependencies array.
     */
    plat.register.injectable('todoRepository', ITodoRepository, [
        models.ITodoFactory,
        plat.storage.ILocalStorage,
        plat.IUtils
    ]);
}
