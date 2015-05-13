/// <reference path="../references.d.ts" />

describe('Testing TodoList TemplateControl to', () => {
	var converters: app.Converters;

	beforeEach(() => {
		converters = plat.acquire(app.Converters);
	});

	describe('make sure pluralize', () => {		
		it('pluralizes values when length !== 1', () => {
			expect(converters.pluralize('hat', 0)).toBe('hats');
		});

		it('does not pluralize values when length === 1', () => {
			expect(converters.pluralize('hat', 1)).toBe('hat');
		});
	});
	
	describe('make sure booleanToSelected', () => {
		it('returns "selected" when passed true', () => {
			expect(converters.booleanToSelected(true)).toBe('selected');
		});

		it('returns "" when passed false', () => {
			expect(converters.booleanToSelected(false)).toBe('');
		});
	});
});
