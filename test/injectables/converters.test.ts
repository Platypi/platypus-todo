/// <reference path="../references.d.ts" />

describe('Testing converters to', () => {
	describe('make sure pluralize', () => {
		var converters: app.Converters;
		
		beforeEach(() => {
			converters = plat.acquire(app.Converters);
		});
		
		it('pluralizes values when length !== 1', () => {
			expect(converters.pluralize('hat', 0)).toBe('hats');
		});

		it('does not pluralize values when length === 1', () => {
			expect(converters.pluralize('hat', 1)).toBe('hat');
		});
	});
});
