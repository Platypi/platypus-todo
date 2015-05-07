/// <reference path="../../references.d.ts" />

module app {
	'use strict';

	export class Converters {
		pluralize(value: string, length: number) {
			if(length !== 1) {
				return value + 's';
			}
			
			return value;
		}
		
		booleanToSelected(bool: boolean) {
			if(bool) {
				return 'selected';
			}
			
			return '';
		}
	}
	
	plat.register.injectable('converters', Converters);
}
