/// <reference path="../../references.d.ts" />

module app {
	'use strict';

	class EnterControl extends plat.controls.KeyDown {
		protected _setListener(): void {
			this._setKeyCodes(['enter']);
            super._setListener();
		}
	}
	
	plat.register.control('on-enter', EnterControl);
}
