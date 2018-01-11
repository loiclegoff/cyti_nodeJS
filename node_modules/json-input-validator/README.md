# json-input-validator

json-input-validator is a node module to validate and clean JSON input.
There are many [basic functions](#basicFunctions) to test types and string formats,
but the main function, [`checkInput()`](#checkInput) can be used to validate and clean a JSON object 
based on field definitions you specify.
It is useful for validating JSON submitted via AJAX or submitted to an API and, when used appropriately, 
can prevent injection attacks.

Given a JSON object, json-input-validator will return a new object that only contains the fields that were defined and 
only if the field values successfully passed the specified tests. 
The returned value for each field is converted to the appropriate type, if possible, and is cleaned up based on the specified actions. 
The end result is that the output can be safely passed on to the rest of the program without fear of missing, invalid, or dangerous values.

Install the module with: `npm install json-input-validator`

## Contents

[**Quick Examples**](#quickExamples)

[**Basic Functions**](#basicFunctions) - [type](#type), [isNumber](#isNumber), [isString](#isString), [isRegexp](#isRegexp), [isFunction](#isFunction), [isArray](#isArray), [isObject](#isObject), [isArrayWithContent](#isArrayWithContent), [isObjectWithContent](#isObjectWithContent), [isDate](#isDate), [isNothing](#isNothing), [isSomething](#isSomething), [isEmpty](#isEmpty), [isNegativeNumber](#isNegativeNumber), [isInteger](#isInteger), [isPositiveInteger](#isPositiveInteger), [isNegativeInteger](#isNegativeInteger), [isDomain](#isDomain), [isHostname](#isHostname), [isEmail](#isEmail), [parseHttpURL](#parseHttpURL), [isHttpURL](#isHttpURL), [parseARN](#parseARN), [isARN](#isARN), [isSesARN](#isSesARN), [stripObject](#stripObject), [stripArray](#stripArray)

[**checkInput**](#checkInput)

[**Release History**](#releaseHistory)

[**License**](#license)


<a name="quickExamples" />


## Quick examples


	var validator = require('json-input-validator');
	
**Define the input fields:**

	var fields = [
		{
			name:		'email_address',
			type:		'string',
			format:		'email',
			require:	'value',
			actions:	['strip', 'lowercase']
		}, {
			name:		'password',
			type:		'string',
			require:	'value'
		}, {
			name:		'password2',
			type:		'string',
			require:	'same as password'
		}, {
			name:		'remember_me',
			type:		'boolean'
		}
	];

**Acceptable input from a user:**
(This would not normally be defined in the code. It would come from a user submission.)

	var input = {
		email_address:	'test@EXAMPLE.COM  ',
		password:		'abc123',
		password2:		'abc123',
		remember_me:	1,
		extra_field:	'qwerty'
	};
	
**Call checkInput():**

	var output = validator.checkInput(input, fields);
	
**The results:**

`data` contains the fields that passed the test with cleaned up values. In this case, `email_address` was cleaned up and `extra_field` was not included because it isn't in the field definitions.

`isModified` is true if any of the values were modified through type conversion or actions.


	output = {
		data: {
			email_address:	'test@example.com',
			password:		'abc123',
			password2:		'abc123',
			remember_me:	true
		},
		errors: {},
		messages: [],
		isModified: true
	};



**More input from a user, but with some problems:**

	var moreInput = {
		email_address:	'test_username',
		password:		'abc123',
		password2:		'abc12'
	};

**The function that does the work:** (again)

	var output = validator.checkInput(moreInput, fields);

**The results:**

`data` only includes the fields that passed their tests. In this case, only the `password` field didn't fail.

`error` provides the kind of error that occurred per field, making it easy for the script to act appropriately or produce an error message.

`messages` provides a list of error messages in English if you want to be lazy and not write your own.

	output = {
		data: {
			password:		'abc123'
		},
		error: {
			email_address:	'format',
			password2:		'require'
		},
		messages: [
			'\'email_address\' is the wrong format',
			'\'password2\' is not the same as \'password\''
		],
		isModified: false
	};

<a name="basicFunctions" />

## Basic Functions

While there are many comprehensive modules that determine value types, these functions are included to provide consistency for the checkInput() function regardless of what other modules are available.

<a name="type" />

### type(arg)

Returns the type of the submitted argument, `arg`, as a string.

Possible return values are: 'null', 'nan', 'undefined', 'boolean', 'number', 'string', 'regexp', 'symbol', 'array', 'object', 'function'

<a name="isNumber" />

### isNumber(arg)

Returns `true` if `arg` is a number. `false` is returned otherwise.

	isNumber(0)						// returns true
	isNumber(1)						// returns true
	isNumber(-1.1)					// returns true
	isNumber(true)					// returns false
	isNumber('a')					// returns false

<a name="isString" />

### isString(arg)

Returns `true` if `arg` is a string. `false` is returned otherwise.

	isString('a')					// returns true
	isString('')					// returns true
	isString(true)					// returns false
	isString(1)						// returns false

<a name="isRegexp" />

### isRegexp(arg)

Returns `true` if `arg` is a regular expression. `false` is returned otherwise.

	isRegexp(/a+/i)					// returns true
	isRegexp(new RegExp('a+', 'i'))	// returns true
	isRegexp(new RegExp(/a+/))		// returns true
	isRegexp('a+')					// returns false
	isRegexp(1)						// returns false

<a name="isFunction" />

### isFunction(arg)

Returns `true` if `arg` is a function. `false` is returned otherwise.

	isFunction(function() { })		// returns true
	isFunction({})					// returns false
	isFunction('function() { }')	// returns false

<a name="isArray" />

### isArray(arg)

Returns `true` if `arg` is an array. `false` is returned otherwise.

	isArray([1, 2])					// returns true
	isArray([])						// returns true
	isArray(1)						// returns false
	isArray(undefined)				// returns false

<a name="isObject" />

### isObject(arg)

Returns `true` if `arg` is an object. `false` is returned otherwise.

	isObject({ 'a': 1 })			// returns true
	isObject({})					// returns true
	isObject(1)						// returns false
	isObject(undefined)				// returns false

<a name="isArrayWithContent" />

### isArrayWithContent(arg)

Returns `true` if `arg` is an array with one or more elements. `false` is returned otherwise.

	isArrayWithContent([1, 2])		// returns true
	isArrayWithContent([0])			// returns true
	isArrayWithContent([''])		// returns true
	isArrayWithContent([])			// returns false
	isArrayWithContent('a')			// returns false

<a name="isObjectWithContent" />

### isObjectWithContent(arg)

Returns `true` if `arg` is an object with one or more keys. `false` is returned otherwise.

	isObjectWithContent({ 'a': 1 })	// returns true
	isObjectWithContent({'a':''})	// returns true
	isObjectWithContent({})			// returns false
	isObjectWithContent('a')		// returns false

<a name="isDate" />

### isDate(arg)

Returns `true` if `arg` is a date/time object. `false` is returned otherwise.

<a name="isNothing" />

### isNothing(arg)

Returns `true` if `arg` is null, undefined, or NaN. `false` is returned otherwise.

	isNothing(null)					// returns true
	isNothing(undefined)			// returns true
	isNothing(NaN)					// returns true
	isNothing(false)				// returns false
	isNothing(0)					// returns false
	isNothing('')					// returns false
	isNothing([])					// returns false
	isNothing({})					// returns false

<a name="isSomething" />

### isSomething(arg)

Returns `true` if `arg` is not null, undefined, or NaN. `false` is returned otherwise.

	isSomething(null)				// returns false
	isSomething(undefined)			// returns false
	isSomething(NaN)				// returns false
	isSomething(false)				// returns true
	isSomething(0)					// returns true
	isSomething('')					// returns true
	isSomething([])					// returns true
	isSomething({})					// returns true

<a name="isEmpty" />

### isEmpty(arg)

Returns `true` if `arg` is null, undefined, NaN, false, 0, a blank string, an empty array, or an empty object. `false` is returned otherwise.

	isEmpty(null)				// returns true
	isEmpty(undefined)			// returns true
	isEmpty(NaN)				// returns true
	isEmpty(false)				// returns true
	isEmpty(0)					// returns true
	isEmpty('')					// returns true
	isEmpty([])					// returns true
	isEmpty({})					// returns true
	isEmpty(true)				// returns false
	isEmpty(1)					// returns false
	isEmpty('a')				// returns false
	isEmpty([1])				// returns false
	isEmpty({'a':1})			// returns false

<a name="isNegativeNumber" />

### isNegativeNumber(arg)

Returns `true` if `arg` is a negative number. `false` is returned otherwise.

	isNegativeNumber(-2)	// returns true
	isNegativeNumber(0)		// returns true
	isNegativeNumber(-1.1)	// returns true
	isNegativeNumber(1)		// returns false (not negative)
	isNegativeNumber('1')	// returns false (not of type number)

<a name="isInteger" />

### isInteger(arg)

Returns `true` if `arg` is an integer. `false` is returned otherwise.

	isInteger(2)			// returns true
	isInteger(0)			// returns true
	isInteger(-1)			// returns true
	isInteger(1.1)			// returns false (not an integer)
	isInteger('1')			// returns false (not of type number)

<a name="isPositiveInteger" />

### isPositiveInteger(arg)

Returns `true` if `arg` is a positive integer. `false` is returned otherwise.

	isPositiveInteger(2)	// returns true
	isPositiveInteger(0)	// returns true
	isPositiveInteger(1.1)	// returns false (not an integer)
	isPositiveInteger(-1)	// returns false (not positive)
	isPositiveInteger('1')	// returns false (not of type number)

<a name="isNegativeInteger" />

### isNegativeInteger(arg)

Returns `true` if `arg` is a negative integer. `false` is returned otherwise.

	isNegativeInteger(-2)	// returns true
	isNegativeInteger(0)	// returns true
	isNegativeInteger(-1.1)	// returns false (not an integer)
	isNegativeInteger(1)	// returns false (not negative)
	isNegativeInteger('-1')	// returns false (not of type number)

<a name="isDomain" />

### isDomain(arg)

Returns `true` if `arg` is a valid second-level + top-level domain name, like 'example.com'. `false` is returned otherwise. Use [`isHostname`](#isHostname) if you will encounter domains of more than two levels. The top-level domain is matched against a list of possible top-level domains as of 2015-10-08. Top-level domains released after that time will not match.

	isDomain('example.com')					// returns true
	isDomain('a.ca')						// returns true
	isDomain('example.co.uk')				// returns false
	isDomain('www.example.com')				// returns false
	isDomain('test@example.com')			// returns false

<a name="isHostname" />

### isHostname(arg)

Returns `true` if `arg` is a valid hostname. `false` is returned otherwise. This uses `isDomain` to validate the top-level domain. See [`isDomain`](#isDomain) for more details.

	isHostname('example.com')				// returns true
	isHostname('a.ca')						// returns true
	isHostname('www.example.com')			// returns true
	isHostname('www.dev.example.com')		// returns true
	isHostname('test@example.com')			// returns false
	isHostname('http://www.example.com')	// returns false

<a name="isEmail" />

### isEmail(arg)

Returns `true` if `arg` is a valid email address. `false` is returned otherwise. This uses `isDomain` to validate the top-level domain in the email address. See [`isDomain`](#isDomain) for more details.

	isEmail('test@example.com')				// returns true
	isEmail('test@mail.example.com')		// returns true
	isEmail('a.b%c@example.com')			// returns true
	isEmail('example.com')					// returns false
	isEmail('mailto:a@b.com')				// returns false

<a name="parseHttpURL" />

### parseHttpURL(arg)

Returns an object containing the components of the URL passed in `arg`. Components include: protocol, hostname, port, path, and queryString. This uses `isDomain` to validate the top-level domain. See [`isDomain`](#isDomain) for more details.

	var urlComponents = validator.parseHttpURL('http://www.example.com');
	//	urlComponents = {
	//		protocol:		'http',
	//		hostname:		'www.example.com'
	//	}

	var urlComponents = validator.parseHttpURL('https://www.example.com:443/test/sample.php?key=value');
	//	urlComponents = {
	//		protocol:		'https',
	//		hostname:		'www.example.com',
	//		port:			'443',
	//		path:			'/test/sample.php',
	//		queryString:	'key=value'
	//	}

<a name="isHttpURL" />

### isHttpURL(arg)

Returns `true` if `arg` is a valid email address. `false` is returned otherwise. This uses `isDomain` to validate the top-level domain. See [`isDomain`](#isDomain) for more details.

	isHttpURL('http://example.com')			// returns true
	isHttpURL('https://www.example.com')	// returns true
	isHttpURL('http://example.com:80')		// returns true
	isHttpURL('http://example.com/test')	// returns true
	isHttpURL('http://example.com?test')	// returns true
	isHttpURL('www.example.com')			// returns false
	isHttpURL('test@mail.example.com')		// returns false

<a name="parseARN" />

### parseARN(arg)

Returns an object containing the components of the Amazon Resource Name (ARN) passed in `arg`. Components include: partition, service, region, accountId, and resource.

	var arnComponents = validator.parseARN('arn:aws:ec2:::instance/*');
	//	arnComponents = {
	//		partition:	'aws',
	//		service:	'ec2',
	//		resource:	'instance/*'
	//	}

	var arnComponents = validator.parseARN('arn:aws:ec2:us-west-2:1234567890:instance/i-1234567');
	//	arnComponents = {
	//		partition:	'aws',
	//		service:	'ec2',
	//		region:		'us-west-2',
	//		accountId:	'1234567890',
	//		resource:	'instance/i-1234567'
	//	}

	var arnComponents = validator.parseARN('arn:aws:ses:us-west-2:1234567890:identity/none@example.com');
	//	arnComponents = {
	//		partition:	'aws',
	//		service:	'ses',
	//		region:		'us-west-2',
	//		accountId:	'1234567890',
	//		resource:	'identity/none@example.com'
	//	}

<a name="isARN" />

### isARN(arg)

Returns `true` if `arg` is a valid Amazon Resource Name (ARN). `false` is returned otherwise.

	isARN('arn:aws:ec2:::instance/*')
		// returns true
	isARN('arn:aws:ec2:us-west-2:1234567890:instance/i-1234567')
		// returns true
	isARN('arn:aws:ses:us-west-2:1234567890:identity/none@example.com')
		// returns true

<a name="isSesARN" />

### isSesARN(arg)

Returns `true` if `arg` is a valid Simple Email Service (SES) Amazon Resource Name (ARN). `false` is returned otherwise.

	isSesARN('arn:aws:ses:us-west-2:1234567890:identity/example.com')
		// returns true
	isSesARN('arn:aws:ses:us-west-2:1234567890:identity/none@example.com')
		// returns true
	isSesARN('arn:aws:ec2:::instance/*')
		// returns false
	isSesARN('arn:aws:ec2:us-west-2:1234567890:instance/i-1234567')
		// returns false

<a name="stripObject" /><a name="stripArray" />

### stripObject(source, isEmpty), stripArray(source, isEmpty)

`stripObject` and `stripArray` modifies the given object or array, `source`, by recursively removing key/value pairs 
or array elements with values that are null, undefined, empty objects, or empty arrays. 
Returns `true` if anything was removed. `false`, otherwise. 
Pass a second argument of `true` to also remove values that are false, 0, or ''.
The two functions are identical and both can take arrays and objects as input.

An example of using `stripObject` on an object. The key names are not relevant.

	var sample = {
		'null':			null,
		'nan':			NaN,
		'undefined':	undefined,
		'boolFalse':	false,
		'boolTrue':		true,
		'numZero':		0,
		'intPositive':	1,
		'stringBlank':	'',
		'stringShort':	'a',
		'arrayEmpty':	[],
		'arrayShort':	[1],
		'arrayLong':	[ 1, [], {}, [1], { b: 2 } ],
		'objectEmpty':	{},
		'objectShort':	{ a: 1 },
		'objectLong':	{ a: 1, b: [], c: {}, d: [1], e: { f: 2 } }
	};
	validator.stripObject(sample);

After `stripObject`, sample contains the following:

	//	sample = {
	//		'boolFalse':	false,
	//		'boolTrue':		true,
	//		'numZero':		0,
	//		'intPositive':	1,
	//		'stringBlank':	'',
	//		'stringShort':	'a',
	//		'arrayShort':	[1],
	//		'arrayLong':	[ 1, [1], { b: 2 } ],
	//		'objectShort':	{ a: 1 },
	//		'objectLong':	{ a: 1, d: [1], e: { f: 2 } }
	//	}

An example using the second argument to also strip false, 0, or ''. The key names are not relevant.

	var sample2 = {
		'null':			null,
		'nan':			NaN,
		'undefined':	undefined,
		'boolFalse':	false,
		'boolTrue':		true,
		'numZero':		0,
		'intPositive':	1,
		'stringBlank':	'',
		'stringShort':	'a'
	};
	validator.stripObject(sample2, true);

After `stripObject`, sample2 contains the following:

	//	sample2 = {
	//		'boolTrue':		true,
	//		'intPositive':	1,
	//		'stringShort':	'a'
	//	}

An example of using `stripArray` on an array.

	var sample = [
		null,
		NaN,
		undefined,
		false,
		true,
		0,
		1,
		'',
		'a',
		[],
		[1],
		[ 1, [], {}, [1], { b: 2 } ],
		{},
		{ a: 1 },
		{ a: 1, b: [], c: {}, d: [1], e: { f: 2 } }
	];
	validator.stripArray(sample);

After `stripArray`, sample contains the following:

	//	sample = [
	//		false,
	//		true,
	//		0,
	//		1,
	//		'',
	//		'a',
	//		[1],
	//		[ 1, [1], { b: 2 } ],
	//		{ a: 1 },
	//		{ a: 1, d: [1], e: { f: 2 } }
	//	]

<a name="checkInput" />

## checkInput(data, fields)

`checkInput` tests an input object and returns a converted version of the object and errors for any values that do not match the field definitions.

### Arguments

* `data` - An object to be checked, usually user-entered data sent as JSON via an API call.
* `fields` - An array of objects. Each object describes a field that should be allowed in the `data` object.

The field definition object can contain the following entries:

* `name` (String) - The name, or key, for this field in the input object. This is _required_.
* `type` (String) - The Javascript type of this field's value used to convert the incoming value or produce error. It should be a string of 'boolean', 'number', 'string', 'array', 'object'. For example, if `type` is set to 'string', but the incoming value is a number, the number is converted to a string or if `type` is set to 'boolean' and the incoming value is a non-blank string or a non-zero number, the value is converted to a boolean set to `true`. If a reasonable conversion can't happen, an error is produced.
* `require` (Boolean or String) - Determines if the field is required and what kind of requirement is needed. 
	* 'exists' or a boolean of `true` - The field must exist. A field with a blank string or a zero still meet this requirement.
	* 'value' - The field must exist and have a value that is not `false`, zero, or a blank string.
	* 'same as {field}' - The field's value must match the value of another field with the given name. This is especially useful for re-entered fields like new passwords. The braces should not be included around the field name.
	* 'different than {field}' - The field's value must NOT match the value of another field with the given name. The braces should not be included around the field name.
	* 'with {field}' - The given field must exist or this field will fail. The braces should not be included around the field name.
	* 'without {field}' - The given field must NOT exist or this field will fail. The braces should not be included around the field name.
* `format` (String) - Checks the contents of the field's value to match a specific pattern.
	* 'domain' - This matches a second-level domain, like 'example.com', but not lower-levels, like 'example.co.uk'. See [`isDomain`](#isDomain) for details.
	* 'hostname' - Matches hostnames according to the [`isHostname`](#isHostname) function.
	* 'email' - Matches email addresses according to the [`isEmail`](#isEmail) function.
	* 'http url' - Matches HTTP URLS, or web site addresses, according to the [`isHttpURL`](#isHttpURL) function.
	* 'integer' - Matches numbers according to the [`isInteger`](#isInteger) function.
	* 'positive integer' - Matches numbers according to the [`isPositiveInteger`](#isPositiveInteger) function.
	* 'negative integer' - Matches numbers according to the [`isNegativeInteger`](#isNegativeInteger) function.
* `regexp` (RegExp) - Checks the contents of the field's value to match the given [regular expression](http://www.wikipedia.org/wiki/Regular_expression). This can be used in conjunction with `format`. For example, if `format` is set to 'email' and `regexp` is set to /@example.com/, anything other than a valid email address at example.com will fail. This only works on fields of `type` 'string'.
* `values` (Array) - An array of whitelisted values. This takes precedence over `format` and `regexp`.
* `actions` (Array of Strings) - An array of actions to perform on fields of `type` 'string'. The actions occur in array order.
	* 'lowercase' - Convert the field's value to lowercase letters.
	* 'uppercase' - Convert the field's value to uppercase letters.
	* 'strip' - Strips leading and trailing whitespace from the field's value.

### Output

The output is an object with the following items.

* `data` - The converted version of original input object. Only fields in the field definitions that pass their validation are included.
* `error` - An object containing items for each failed field test. Keys in the object are the names of the fields that failed and the values are the test on which it failed. For example, if a field named 'password' has `require` set to 'value' and no value is submitted, `error` would at least contain a key of `password` with a value of 'require'. This can be used to generate error messages for a user.
* `messages` - An array of English error messages. This is the lazy way of displaying errors instead of using the `error` object to assemble your own.
* `isModified` - A boolean that is `true` if any field values in `data` were modified from the original input object.

### Examples of field definitions

For a full example, check the [**Quick Examples**](#quickExamples) section.

__Example: Limiting fields in input__

When receiving input from an API, you may want to make sure the incoming data only contains the fields you want in the right Javascript type. In this case, regardless of what is submitted, the returned object will only contain the three fields in the appropriate types.

	var fields = [
		{
			name:		'first_name',
			type:		'string'
		}, {
			name:		'last_name',
			type:		'string'
		}, {
			name:		'age',
			type:		'number'
		}
	];

__Example: Requiring fields to have a value__

Using the previous example, making 'first\_name' and 'last\_name' required is a matter of adding `require` to each field definition. However, setting it to 'exists' or a boolean of `true` only makes sure the field exists, but does not require a value to be in the field. To require a non-blank or non-zero value, use 'value'.

	var fields = [
		{
			name:		'first_name',
			type:		'string',
			require:	'value'
		}, {
			name:		'last_name',
			type:		'string',
			require:	'value'
		}, {
			name:		'age',
			type:		'number'
		}
	];

__Example: Requiring fields to have the same value__

Sometimes a requirement may be based on another field. For example, with two password fields, named `password` and `password_retype`, you could require the second match.

	var fields = [
		{
			name:		'password',
			type:		'string',
			require:	'value'
		}, {
			name:		'password_retype',
			type:		'string',
			require:	'same as password'
		}
	];

__Example: Restricting field values by format__

The value of fields can be restricted even further by requiring the input to match a certain pattern. Check for invalid email addresses or an age that isn't a positive integer using `format`.

	var fields = [
		{
			name:		'email_address',
			type:		'string',
			require:	'value',
			format:		'email'
		}, {
			name:		'age',
			type:		'number',
			require:	'value',
			format:		'positive integer'
		}
	];

__Example: Restricting field values by regular expression__

Using `regexp`, restrict the content of a field by regular expressions. In this example, make sure the first name only contains letters.

	var fields = [
		{
			name:		'first_name',
			type:		'string',
			require:	'value',
			regexp:		/^[a-zA-Z]+$/
		}
	];

__Example: Restricting field values by a whitelist__

If there is a limited number of possible answers, a whitelist may be the best choice. A menu or radio buttons in a web form may only contain certain values, but that doesn't prevent someone from submitting other values if they know what they are doing. You can prevent that from happening with a whitelist.

	var fields = [
		{
			name:		'color',
			type:		'string',
			values:		['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
		}
	];

__Example: Modifying field values with actions__

Sometimes users accidentally hit a space after what they type or type with caps lock on. To prevent dumb entry problems from becoming errors, you can use actions to clean up the input automatically. For example, an email address or username shouldn't contain extra whitespace and isn't usually case sensitive. However, when comparing input against an existing record, whitespace and capitalization can prevent a match. Using `actions` can normalize the input to prevent that from being a problem. In this case, use the 'strip' action to remove leading and trailing whitespace and use the 'lowercase' action to make the input all lowercase.

	var fields = [
		{
			name:		'username',
			type:		'string',
			require:	'value',
			actions:	['strip', 'lowercase']
		}
	];




	
<a name="releaseHistory" />

## Release History
0.1	First version

<a name="license" />

## License
Copyright (c) 2015 Tim Moses  
Licensed under the GNU license.
