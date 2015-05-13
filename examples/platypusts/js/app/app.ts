/// <reference path="../references.d.ts" />

module app {
	'use strict';
	class App extends plat.App {
		constructor(router: plat.routing.Router, browserConfig: plat.web.IBrowserConfig) {
			super();
			browserConfig.baseUrl = 'examples/platypusts';
			router.configure([
				{ pattern: '', view: TodoControl },
				{ pattern: '/:status', view: TodoControl, alias: 'status' }
			]);
		}
	}

	plat.register.app('app', App, [
		plat.routing.Router,
		plat.web.IBrowserConfig
	]);
};
