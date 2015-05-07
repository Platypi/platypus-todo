interface ITodo {
	label: string;
	editing?: boolean;
	completed?: boolean;
}

interface IRefresh {
	refresh: (todos: Array<ITodo>) => void;
}

interface IFilter {
	show: (completed: boolean) => boolean;
}

interface IFilterAndRefresh extends IFilter, IRefresh { }
