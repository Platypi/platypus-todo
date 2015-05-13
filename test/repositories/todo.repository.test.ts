/// <reference path="../references.d.ts" />

describe('Testing Todo repository to', () => {
	var repository: app.TodoRepository,
		storage: plat.storage.LocalStorage,
		key = 'todos-platypusts',
		defaultItems: Array<ITodo> = [
			{ label: 'Taste JavaScript', completed: true },
			{ label: 'Buy a unicorn', completed: false }
		];

	beforeEach(() => {
		repository = plat.acquire(app.TodoRepository);
		storage = plat.acquire(plat.storage.LocalStorage);
		storage.setItem(key, undefined);
	});

	describe('make sure pull returns a Promise<Array<ITodo>>', () => {
		it('with values when they exist in storage', (done) => {
			storage.setItem(key, JSON.stringify(defaultItems));
			
			repository.pull()
			.then((items) => {
				expect(items).toEqual(defaultItems);
			})
			.then(done, done);
		});

		it('with an empty array when nothing is in storage', (done) => {
			repository.pull()
			.then((items) => {
				expect(items).toEqual([]);
			})
			.then(done, done);
		});
	});
	
	describe('make sure push returns a Promise<void> and', () => {
		it('stores todos', (done) => {
			repository.push(defaultItems)
			.then((isUndefined) => {
				expect(isUndefined).toBeUndefined();
				expect(storage.getItem(key)).toBe(JSON.stringify(defaultItems));
			})
			.then(done, done);
		});
		
		it('removes edit mode on stored todos', (done) => {
			defaultItems[0].editing = true;
			repository.push(defaultItems)
			.then((isUndefined) => {
				expect(isUndefined).toBeUndefined();
				expect(JSON.parse(storage.getItem<string>(key))[0].editing).toBeUndefined();
			})
			.then(done, done);
		});
	});
});
