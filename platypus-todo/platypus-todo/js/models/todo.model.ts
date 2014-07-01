module app.models {
    'use strict';

    export class Todo implements ITodo {
        static createInstance(title: string, completed: boolean, id?: string): ITodo {
            return new Todo(title, completed, id || Todo.utils.uniqueId('todo_'));
        }

        static utils: plat.IUtils;

        constructor(public title: string, public completed: boolean, public id: string) { }
    }

    /**
     * An ITodo defines the interface for a todo item.
     */
    export interface ITodo {
        /**
         * A unique id for a todo.
         */
        id: string;
        /**
         * The title of the todo.
         */
        title: string;
        /**
         * Whether or not the todo is completed.
         */
        completed: boolean;
    }

    export interface ITodoFactory {
        /**
         * Returns an ITodo with the given title and completed values.
         *
         * @param title The title of the todo.
         * @param completed Whether or not the todo is completed.
         * @param id an optional id for the todo.
         */
        createInstance(title: string, completed: boolean, id?: string): ITodo;
    }

    /**
     * This is the static constructor for the TodoFactory. TodoFactory is a 
     * static class, yet it has dependencies. We allow you to register injectables 
     * as "static" and specify a static constructor which will return the class.
     */
    export function ITodoFactory(utils) {
        Todo.utils = utils;
        return Todo;
    }

    /**
     * Injectables can be of type static. Here you see that the TodoFactoryStatic 
     * constructor is referenced. All STATIC injectables will be injected when the 
     * app starts, and used throughout the application lifetime.
     */
    plat.register.injectable('todoFactory', ITodoFactory, [
        plat.IUtils
    ], plat.register.injectable.FACTORY);
}
