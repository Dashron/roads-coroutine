"use strict";

/**
* roads-coroutine.js
* Copyright(c) 2015 Aaron Hedges <aaron@dashron.com>
* MIT Licensed
 */

module.exports = function (generator_function) {
	// This is valid, but it might be better to execute the function and check if the 
	if (['GeneratorFunction'].indexOf(generator_function.constructor.name) === -1) {
		return generator_function;
	}

	return function () {
		// Support binding to the coroutine by passing the context and arguments into the generator function
		var method_this = this;
		var method_args = arguments;

		return new Promise(function (resolve, reject) {
			var generator = generator_function.apply(method_this, method_args);

			// This method will execute all the run logic, except it will throw the error from the yield instead of return it.
			var runThrow = function (err) {
				return run(err, 'throw');
			};

			var run = function runGenerator (val, func) {
				if (!func) {
					func = 'next';
				}

				var gen_response = null;

				try {
					gen_response = generator[func](val);

					if (!gen_response.done) {
						return Promise.resolve(gen_response.value).then(run, runThrow);
					} else {
						return resolve(gen_response.value);
					}

				} catch (err) {
					return reject(err);
				}
			};

			return run();
		});
	};
};