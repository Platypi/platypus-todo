/// <reference path="../references.d.ts" />

module app {
	'use strict';

	class EscapeControl extends plat.controls.KeyDown {
		protected _setListener(): void {
			this._setKeyCodes(['escape']);
            super._setListener();
		}
	}
	
	plat.register.control('on-escape', EscapeControl);
}
