/// <reference path="../references.d.ts" />

describe('Testing converters to', () => {
	describe('make sure pluralize', () => {
		it('pluralizes values when length !== 1', () => {
			var converters: app.Converters = plat.acquire(app.Converters);
			
			expect(converters.pluralize('hat', 0)).toBe('hats');
		});
	});
});
