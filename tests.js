var coroutine = require('./index');

/**
 * Normal functions
 */
exports['coroutine executes normal function'] = function (test) {
	var result = coroutine(function () {
		return 'yes';
	})();

	test.equal('yes', result);
	test.done();
};

exports['coroutine executes normal function and retains context'] = function (test) {
	var result = coroutine(function () {
		return this;
	}).bind('what')();

	test.equal('what', result);
	test.done();
};

exports['coroutine executes normal function and retains parameters'] = function (test) {
	var result = coroutine(function (arg1, arg2) {
		return arg1 + arg2;
	})('a', 'b');

	test.equal('ab', result);
	test.done();
};


exports['coroutine executes function without returning'] = function (test) {
	var result = coroutine(function () {
		var a = 1+1;
	})();

	test.equal(undefined, result);
	test.done();
};

/**
 * Generator functions without yield
 */
exports['coroutine executes generator function'] = function (test) {
	var result = coroutine(function* () {
		return 'yes';
	})().then(function (result) {
		test.equal('yes', result);
		test.done();
	})
	.catch(function (err) {
		console.log(err);
		test.fail(err);
		test.done();
	});;
};

exports['coroutine executes generator function and retains context'] = function (test) {
	var result = coroutine(function* () {
		return this;
	}).bind('what')()
	.then(function (result) {
		test.equal('what', result);
		test.done();
	})
	.catch(function (err) {
		console.log(err);
		test.fail(err);
		test.done();
	});;
};

exports['coroutine executes generator function and retains parameters'] = function (test) {
	var result = coroutine(function* (arg1, arg2) {
		return arg1 + arg2;
	})('a', 'b').then(function (result) {
		test.equal('ab', result);
		test.done();
	})
	.catch(function (err) {
		console.log(err);
		test.fail(err);
		test.done();
	});
};

exports['coroutine executes generator function without returning'] = function (test) {
	var result = coroutine(function* () {
		var a = 1+1;
	})().then(function (result) {
		test.equal(undefined, result);
		test.done();
	});
};

/**
 * Generator functions with yields
 */
exports['coroutine executes generator function yielding primitives'] = function (test) {
	var result = coroutine(function* () {
		var test = yield 'yes';
		return test;
	})().then(function (result) {
		test.equal('yes', result);
		test.done();
	})
	.catch(function (err) {
		console.log(err);
		test.fail(err);
		test.done();
	});
};

exports['coroutine executes generator function yielding promises'] = function (test) {
	var result = coroutine(function* () {
		var test = yield new Promise(function (resolve, reject) {
			resolve('yes');
		});

		return test;
	})().then(function (result) {
		test.equal('yes', result);
		test.done();
	})
	.catch(function (err) {
		console.log(err);
		test.fail(err);
		test.done();
	});
};

exports['coroutine executes generator function yielding promises rejecting values'] = function (test) {
	var result = coroutine(function* () {
		var test = yield new Promise(function (resolve, reject) {
			reject('yes');
		});

		return test;
	})().catch(function (result) {
		test.equal('yes', result);
		test.done();
	});
};

exports['coroutine executes generator function yielding promises throwing errors'] = function (test) {
	var result = coroutine(function* () {
		var test = yield new Promise(function (resolve, reject) {
			throw new Error('yes')
		});

		return test;
	})().catch(function (result) {
		test.equal('yes', result.message);
		test.done();
	});
};

exports['coroutine executes generator function throwing error before yielding'] = function (test) {
	var result = coroutine(function* () {
		throw new Error('oh no');
		var test = yield "yes";

		return test;
	})().catch(function (result) {
		test.equal('oh no', result.message);
		test.done();
	});
};

exports['coroutine executes generator function throwing error after yielding'] = function (test) {
	var result = coroutine(function* () {
		var test = yield "yes";
		throw new Error('oh no');
		return test;
	})()
	.then(function (result) {
		test.fail(result);
		test.done();
	}, function (error) {
		test.equal('oh no', error.message);
		test.done();
	});
};

/**
 * .bind method still works. NOTE YOU MUST BIND BEFORE YOU WRAP THE COROUTINE
 */
exports['coroutine passed through bound contexts'] = function (test) {
	var fn = coroutine(function* (foo) {
		return this + foo;
	}).bind('hello', 'world');

	fn().then(function (response) {
		test.equal('helloworld', response);
		test.done();
	})
}

exports['coroutine with yield passed through bound contexts'] = function (test) {
	var fn = coroutine(function* (foo) {
		var a = yield foo;
		return this + foo;
	}).bind('hello', 'world');

	fn().then(function (response) {
		test.equal('helloworld', response);
		test.done();
	})
}

exports['test yield exceptions catchable in generator function'] = function (test) {
	var fn = coroutine(function* (foo) {
		try {
			var a = yield foo;
		} catch (e) {
			return e;
		}

		return a;
	});

	var err = new Error('surface error');

	fn(new Promise(function (resolve, reject) {
		reject(err);
	})).then(function (response) {
		test.equal(response, err);
		test.done();
	}).catch(function (err) {
		test.fail(err);
		test.done();
	});
}
