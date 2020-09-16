let openAPI3Doc = {
	openapi: "3.0.1",
	info: {
		title: "Swagger JSON Generator",
		description: "This is a description",
		version: "1.0.0"
	},
	externalDocs: {
		description: "Reach out to me @ yeshwanthraghavendra@gmail.com",
		url: "yeshwanthraghavndra@gmail.com"
	},
	servers: [
		{
			url: "https://devurl.com/"
		}
	],
	tags: [
		{
			name: "pet",
			description: "Everything about your Pets"
		}
	],
	paths: {
		"/test": {
			get: {
				tags: ["pet"],
				summary: "uploads an image",
				operationId: "uploadFile",
				responses: {
					"200": {
						description: "successful operation",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ApiResponse"
								}
							}
						}
					}
				}
			}
		}
	},
	components: {
		schemas: {
			ApiResponse: {
				type: "object",
				properties: {
					code: {
						type: "integer",
						format: "int32"
					},
					type: {
						type: "string"
					},
					message: {
						type: "string"
					}
				}
			}
		}
	}
};

let apiRequest =
	"https://jsonplaceholder.typicode.com/users/1?name=yeshwanth&age=25";
let apiRequestSplit = apiRequest.split("://")[1].split("/")[0];
let serverUrl = apiRequest.split(apiRequestSplit)[0] + apiRequestSplit;
// let serverUrl = 'https://jsonplaceholder.typicode.com'
let requestType = "POST";
let response = [
	{
		id: 1,
		name: "Leanne Graham",
		username: "Bret",
		tags: ["name", "age"],
		num: [3, 8],
		email: "Sincere@april.biz",
		address: {
			street: "Kulas Light",
			suite: "Apt. 556",
			city: "Gwenborough",
			zipcode: "92998-3874",
			geo: [
				{
					lat: "-37.3159",
					lng: "81.1496"
				}
			],
			heo: ["name", "age"]
		},
		phone: "1-770-736-8031 x56442",
		website: "hildegard.org",
		company: {
			name: "Romaguera-Crona",
			catchPhrase: "Multi-layered client-server neural-net",
			bs: "harness real-time e-markets"
		}
	}
];
let responseCode = 200;
let tagName = "user";
tagName = tagName.split(",");

let isPathParamAvailale = true;
let pathParamStringInAboveURL = ["1"];
let pathParamName = ["userId"];

let requestBody = [...response];
let parseResponse = true;
let parseRequestBodyObject = false;

/**
 * Initilization of API input object
 */
let apiRequestData = [
	{
		serverUrl,
		apiRequest,
		requestType,
		requestBody,
		parseRequestBodyObject,
		tagName,
		isPathParamAvailale,
		pathParamStringInAboveURL,
		pathParamName,
		paramsObjectArray: [],
		response,
		responseCode,
		parseResponse
	}
];

/**
 * Server Urls List logic
 */
apiRequestData.forEach(req => {
	openAPI3Doc.servers.push({
		url: req.serverUrl
	});

	/**
	 * Tag Names Logic
	 */
	req.tagName.forEach(tag => {
		openAPI3Doc.tags.push({
			name: tag,
			description: "Everything about your " + tag
		});
	});

	/**
	 * Path Params Logic
	 */
	if (isPathParamAvailale) {
		req.pathParamStringInAboveURL.forEach((pathData, pathIndex) => {
			let source = `/${req.pathParamStringInAboveURL[pathIndex]}/`;
			let destination = `/{${req.pathParamName[pathIndex]}}/`;
			if (req.apiRequest.indexOf(source) > -1) {
				req.apiRequest = req.apiRequest.replace(source, destination);
			} else {
				source = `/${req.pathParamStringInAboveURL[pathIndex]}?`;
				destination = `/{${req.pathParamName[pathIndex]}}?`;
				req.apiRequest = req.apiRequest.replace(source, destination);
			}

			let key = req.pathParamName[pathIndex];
			let value = req.pathParamStringInAboveURL[pathIndex];
			let valueType = "string";
			if (value * 1 > 0) {
				value = value * 1;
				valueType = "integer";
			}
			if (["true", "false"].includes(value)) {
				valueType = "boolean";
			}
			req.paramsObjectArray.push({
				name: key,
				in: "path",
				description: "Path param " + key + " description",
				required: true,
				schema: {
					type: valueType
				}
			});
		});
	}

	/**
	 * Query Params Logic
	 */
	let isQueryParamAvailable = false;
	let queryParamIndex = req.apiRequest.indexOf("?");
	if (queryParamIndex > -1) {
		isQueryParamAvailable = true;
		let queryPramsList = req.apiRequest.split("?")[1].split("&");
		queryPramsList.forEach(queryData => {
			let key = queryData.split("=")[0];
			let value = queryData.split("=")[1];
			let valueType = "string";
			if (value * 1 > 0) {
				value = value * 1;
				valueType = "integer";
			}
			if (["true", "false"].includes(value)) {
				valueType = "boolean";
			}
			req.paramsObjectArray.push({
				name: key,
				in: "query",
				description: "Query param " + key + " description",
				required: false,
				schema: {
					type: valueType
				}
			});
		});
	}

	/**
	 * New Route Creation in Open API Specs paths object
	 */
	let routeName = req.apiRequest.split("?")[0].split(req.serverUrl)[1];
	let pathObject = {};
	let resCode = req.responseCode;
	let responseData = req.response;

	let schemaObject = {};

	pathObject[routeName] = {};
	pathObject[routeName][req.requestType.toLowerCase()] = {
		tags: req.tagName,
		summary: `${req.requestType.toUpperCase()} API request of ${routeName}`,
		operationId: routeName,
		servers: openAPI3Doc.servers,
		parameters: req.paramsObjectArray,
		responses: {
			"200": {
				description: "Successfully completed API request",
				content: {}
			},
			"400": {
				description: "Invalid input",
				content: {}
			},
			"500": {
				description: "It's not you. Something went wrong in the service.",
				content: {}
			}
		}
	};

	/**
	 * Response Object + Schema initalization
	 */
	let responseObject = {};
	console.log(req.parseResponse, "res");
	if (req.parseResponse) {
		schemaObject = {
			resSchemaName: {}
		};
		responseObject[resCode] = {
			description: "successful operation",
			content: {
				"application/json": {
					schema: {}
				}
			}
		};

		/**
		 * SchemasName declaration in route paths object for Request Body
		 */
		if (typeof responseData == "object") {
			console.log("isArrayRes", Array.isArray(responseData));
			if (Array.isArray(responseData)) {
				responseData = responseData[0];
				responseObject[resCode + ""]["content"]["application/json"][
					"schema"
				] = {
					type: "array",
					items: {
						$ref: "#/components/schemas/resSchemaName"
					}
				};
			} else {
				responseObject[resCode + ""]["content"]["application/json"][
					"schema"
				] = {
					$ref: "#/components/schemas/resSchemaName"
				};
			}
			pathObject[routeName][req.requestType.toLowerCase()]["responses"] = {
				...responseObject
			};
		}

		/**
		 * Schemas creation in schema object for Response
		 */
		responseData = JSON.parse(JSON.stringify(responseData));
		if (Array.isArray(responseData)) {
			console.log("-----");
			schemaObject["resSchemaName"] = {
				type: "array",
				items: {
					$ref: "#/components/schemas/resSchemaArray"
				}
			};
			schemaGenerator(responseData[0], "resSchemaArray");
		} else {
			schemaGenerator(responseData, "resSchemaName");
		}
	}

	/**
	 * Request body & Schema Formation
	 */
	let requestBodyData = req.requestBody;
	let requestBodyObject = {};
	if (
		parseRequestBodyObject &&
		["POST", "PUT"].includes(req.requestType.toUpperCase())
	) {
		/**
		 * Req body template creation
		 */
		requestBodyObject = {
			description: "req body",
			content: {
				"*/*": {
					schema: {}
				}
			}
		};

		/**
		 * SchemasName declaration in route paths object for Request Body
		 */
		if (typeof requestBodyData == "object") {
			console.log("isArrayBody", Array.isArray(requestBodyData));
			if (Array.isArray(requestBodyData)) {
				requestBodyData = requestBodyData[0];
				requestBodyObject["content"]["*/*"]["schema"] = {
					type: "array",
					items: {
						$ref: "#/components/schemas/reqBodySchemaName"
					}
				};
			} else {
				requestBodyObject["content"]["*/*"]["schema"] = {
					$ref: "#/components/schemas/reqBodySchemaName"
				};
			}
			pathObject[routeName][req.requestType.toLowerCase()]["requestBody"] = {
				...requestBodyObject
			};
		}

		/**
		 * Schemas creation in schema object for Request Body
		 */
		schemaObject = {
			...schemaObject,
			reqBodySchemaName: {}
		};
		requestBodyData = JSON.parse(JSON.stringify(requestBodyData));

		if (Array.isArray(requestBodyData)) {
			console.log("-----");
			schemaObject["reqBodySchemaName"] = {
				type: "array",
				items: {
					$ref: "#/components/schemas/reqBodySchemaArray"
				}
			};
			schemaGenerator(requestBodyData[0], "reqBodySchemaArray", null, "req_");
		} else {
			schemaGenerator(requestBodyData, "reqBodySchemaName", null, "req_");
		}
	} else {
		if (["POST", "PUT"].includes(req.requestType.toUpperCase())) {
			requestBodyObject = {
				description: "req body",
				content: {
					"*/*": {
						schema: {}
					}
				}
			};
			pathObject[routeName][req.requestType.toLowerCase()]["requestBody"] = {
				...requestBodyObject
			};
		}
	}

	/**
	 * schema generator function
	 */
	function schemaGenerator(
		responseData,
		schemaName = "schemaName",
		objecTypename = null,
		apiType = "res_"
	) {
		schemaObject[schemaName] = {
			type: "object",
			properties: {}
		};
		if (objecTypename) {
			responseData = responseData[objecTypename];
		}
		Object.keys(responseData).forEach(item => {
			if (typeof responseData[item] == "object") {
				let objecTypename = "object";

				if (Array.isArray(responseData[item])) {
					objecTypename = "array";
				}
				schemaObject[schemaName]["properties"][item] = {
					type: objecTypename
				};
				let keyName = item + "arrayObject";
				if (objecTypename == "array") {
					responseData[item] = [responseData[item][0]];
					if (typeof responseData[item][0] == "object") {
						objecTypename = "array";
						let x = responseData[item][0];
						responseData[item] = {};
						responseData[item][keyName] = x;
					} else {
						objecTypename = typeof responseData[item][0];
					}
				}
				let output = responseData[item];

				if (["array", "object"].includes(objecTypename)) {
					objecTypename === "array" ? console.log(keyName) : null;
					objecTypename === "array"
						? schemaGenerator(output, apiType + item + "List", keyName, apiType)
						: schemaGenerator(output, apiType + item + "List", null, apiType);
					if (objecTypename == "object") {
						schemaObject[schemaName]["properties"][item]["$ref"] =
							"#/components/schemas/" + apiType + item + "List";
					} else {
						schemaObject[schemaName]["properties"][item]["items"] = {};
						schemaObject[schemaName]["properties"][item]["items"]["$ref"] =
							"#/components/schemas/" + apiType + item + "List";
					}
					// schemaObject[schemaName]['properties'][item]['$ref'] = '#/components/schemas/' + item
				} else {
					schemaObject[schemaName]["properties"][item]["type"] = "array";
					schemaObject[schemaName]["properties"][item]["items"] = {
						type: objecTypename
					};
				}
			} else {
				schemaObject[schemaName]["properties"][item] = {
					type: typeof responseData[item],
					example: responseData[item]
				};
			}
		});
	}

	openAPI3Doc.paths = { ...openAPI3Doc.paths, ...pathObject };
	openAPI3Doc.components.schemas = {
		...openAPI3Doc.components.schemas,
		...schemaObject
	};

	console.log(JSON.stringify(openAPI3Doc /* , null, 2 */));
});
