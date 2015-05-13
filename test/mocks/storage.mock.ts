/// <reference path="../references.d.ts" />

class MockStorage extends plat.storage.LocalStorage {
	item: string;

	getItem(key: string) {
		return this.item;
	}
	
	setItem(key: string, value: string) {
		this.item = value;
	}
}

plat.register.injectable('$LocalStorage', MockStorage);
