import React from "react";
import {
  Row,
  Col,
  Container,
  Dropdown,
  ButtonGroup,
  Button
} from "react-bootstrap";
export class APIData extends React.Component {
  constructor(props) {
    super(props);
    this.schemaObject = {};
    this.state = {
      apiRequest:
        "http://txsliopda8v.nss.vzwnet.com:8034/vppm/getActivityLogs/1?pmListId=384",
      serverUrl: "http://txsliopda8v.nss.vzwnet.com:8034",
      requestType: "GET",
      pathParamAvailable: false,
      tags: "",
      pathParamStringInAboveURL: [],
      pathParamName: [],
      response: null,
      responseCode: 200,
      requestBody: null,
      parseResponse: true,
      parseRequestBodyObject: false,
      outputOpenAPISchema: "",
      uniqueId: ""
    };
    this.schemaData = null;
  }

  changePathParamName = (type, index, value, action = "insert") => {
    if (action === "insert") {
      if (type === "value") {
        let data = [...this.state.pathParamStringInAboveURL];
        data[index] = value;
        this.setState({ pathParamStringInAboveURL: data });
      }
      if (type === "key") {
        let data = [...this.state.pathParamName];
        data[index] = value;
        this.setState({ pathParamName: data });
      }
    }

    if (action === "add") {
      let data = [];
      let data1 = [];
      if (this.state.pathParamStringInAboveURL.length > 0) {
        data = [...this.state.pathParamStringInAboveURL];
        data1 = [...this.state.pathParamName];
      }

      data[data.length] = "";
      data1[data1.length] = "";

      this.setState({ pathParamStringInAboveURL: data, pathParamName: data1 });
    }

    if (action === "delete") {
      let data = this.state.pathParamStringInAboveURL.filter(
        (i, id) => id !== index
      );
      let data1 = this.state.pathParamName.filter((i, id) => id !== index);
      this.setState({ pathParamStringInAboveURL: data, pathParamName: data1 });
    }
  };

  renderPathparamData = () => {
    let items = [];
    for (let i = 0; i < this.state.pathParamStringInAboveURL.length; i++) {
      items.push(
        <>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <div className="block">
              <label>Param in api</label>
              <input
                type="text"
                value={this.state.pathParamStringInAboveURL[i]}
                onChange={e =>
                  this.changePathParamName("value", i, e.target.value, "insert")
                }
                className="form-control"
                placeholder="Ex: 1"
              />
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <div className="block">
              <label>Param Name</label>
              <input
                type="text"
                value={this.state.pathParamName[i]}
                onChange={e =>
                  this.changePathParamName("key", i, e.target.value, "insert")
                }
                className="form-control"
                placeholder="Ex: ListId"
              />
              <span
                className="removePathParam"
                onClick={e => this.changePathParamName(null, i, null, "delete")}
              >
                {" "}
                X{" "}
              </span>
            </div>
          </Col>
        </>
      );
    }
    return items;
  };

  generateSpec = () => {
    let len = 10,
      arr = "123456789abcdefghijklmnopqrstuvw",
      ans = "_";
    for (var i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    this.setState({ outputOpenAPISchema: "" });
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
          url: "https://demoURL.com/"
        }
      ],
      tags: [
        {
          name: "Test",
          description: "Everything about your Test folder"
        }
      ],
      paths: {},
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

    if (this.schemaData) {
      openAPI3Doc = this.schemaData;
    }

    let {
      serverUrl,
      apiRequest,
      requestType,
      requestBody,
      parseRequestBodyObject,
      pathParamStringInAboveURL,
      pathParamName,
      response,
      responseCode,
      parseResponse
    } = this.state;
    let tagName = this.state.tags.split(",");
    let isPathParamAvailale = this.state.pathParamAvailable;
    console.log("=========", this.state.response);

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
      let serverExists = false;
      openAPI3Doc.servers.forEach(i => {
        if (i.url == req.serverUrl) {
          serverExists = true;
        }
      });
      if (!serverExists) {
        openAPI3Doc.servers.push({
          url: req.serverUrl
        });
      }

      /**
       * Tag Names Logic
       */
      let tagExists = false;

      req.tagName.forEach(tag => {
        let tagExists = false;
        openAPI3Doc.tags.forEach(i => {
          if (i.name == tag) {
            tagExists = true;
          }
        });
        if (!tagExists) {
          openAPI3Doc.tags.push({
            name: tag,
            description: "Everything about your " + tag
          });
        }
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
            if (req.apiRequest.indexOf(source) > -1) {
              req.apiRequest = req.apiRequest.replace(source, destination);
            } else {
              source = `/${req.pathParamStringInAboveURL[pathIndex]}`;
              destination = `/{${req.pathParamName[pathIndex]}}`;
              if (req.apiRequest.indexOf(source) > -1) {
                req.apiRequest = req.apiRequest.replace(source, destination);
              }
            }
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
      if (req.parseResponse) {
        this.schemaObject = {};
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
        if (typeof responseData === "object") {
          if (Array.isArray(responseData)) {
            responseData = responseData[0];
            responseObject[resCode + ""]["content"]["application/json"][
              "schema"
            ] = {
              type: "array",
              items: {
                $ref: "#/components/schemas/res" + ans
              }
            };
          } else {
            responseObject[resCode + ""]["content"]["application/json"][
              "schema"
            ] = {
              $ref: "#/components/schemas/res" + ans
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
          this.schemaObject["res" + ans] = {
            type: "array",
            items: {
              $ref: "#/components/schemas/res" + ans + "Array"
            }
          };
          this.schemaGenerator(
            responseData[0],
            "res" + ans + "Array",
            null,
            "res" + ans
          );
        } else {
          this.schemaGenerator(responseData, "res" + ans, null, "res" + ans);
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
            "application/json": {
              schema: {}
            }
          }
        };

        /**
         * SchemasName declaration in route paths object for Request Body
         */
        if (typeof requestBodyData === "object") {
          if (Array.isArray(requestBodyData)) {
            // requestBodyData = requestBodyData[0];
            requestBodyObject["content"]["application/json"]["schema"] = {
              type: "array",
              items: {
                $ref: "#/components/schemas/reqBody" + ans + "Array"
              }
            };
          } else {
            requestBodyObject["content"]["application/json"]["schema"] = {
              $ref: "#/components/schemas/reqBody" + ans
            };
          }
          pathObject[routeName][req.requestType.toLowerCase()][
            "requestBody"
          ] = {
            ...requestBodyObject
          };
        }

        /**
         * Schemas creation in schema object for Request Body
         */
        let schemObjName = "reqBody" + ans;
        this.schemaObject = {
          ...this.schemaObject
        };
        this.schemaObject[schemObjName] = {};
        requestBodyData = JSON.parse(JSON.stringify(requestBodyData));
        console.log(
          "Array.isArray(requestBodyData)",
          Array.isArray(requestBodyData)
        );

        if (Array.isArray(requestBodyData)) {
          this.schemaObject[schemObjName] = {
            type: "array",
            items: {
              $ref: "#/components/schemas/reqBody" + ans + "Array"
            }
          };
          console.log("Arra");
          this.schemaGenerator(
            requestBodyData[0],
            "reqBody" + ans + "Array",
            null,
            "reqBody" + ans
          );
        } else {
          console.log("non arr");
          this.schemaGenerator(
            requestBodyData,
            schemObjName,
            null,
            "reqBody" + ans
          );
        }
      } else {
        if (["POST", "PUT"].includes(req.requestType.toUpperCase())) {
          requestBodyObject = {
            description: "req body",
            content: {
              "application/json": {
                schema: {}
              }
            }
          };
          pathObject[routeName][req.requestType.toLowerCase()][
            "requestBody"
          ] = {
            ...requestBodyObject
          };
        }
      }

      openAPI3Doc.paths = { ...openAPI3Doc.paths, ...pathObject };
      openAPI3Doc.components.schemas = {
        ...openAPI3Doc.components.schemas,
        ...this.schemaObject
      };
      // console.log(JSON.stringify(openAPI3Doc /* , null, 2 */));
      this.setState({
        outputOpenAPISchema: JSON.stringify(openAPI3Doc, null, 2)
      });
      this.schemaData = openAPI3Doc;
      console.log(this.schemaData);
    });
  };

  schemaGenerator = (
    responseData,
    schemaName = "schemaName",
    objecTypename = null,
    apiType = "res_"
  ) => {
    // console.log(responseData, schemaName, objecTypename);
    this.schemaObject[schemaName] = {
      type: "object",
      properties: {}
    };
    if (objecTypename) {
      responseData = responseData[objecTypename];
    }
    Object.keys(responseData).forEach(item => {
      if (responseData[item] && typeof responseData[item] === "object") {
        let objecTypename = "object";

        if (Array.isArray(responseData[item])) {
          objecTypename = "array";
        }
        this.schemaObject[schemaName]["properties"][item] = {
          type: objecTypename
        };
        let keyName = item + "arrayObject";
        if (objecTypename === "array") {
          responseData[item] = [responseData[item][0]];
          if (typeof responseData[item][0] === "object") {
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
          // objecTypename === "array" ? console.log(keyName) : null;
          objecTypename === "array"
            ? this.schemaGenerator(
                output,
                apiType + item + "List",
                keyName,
                apiType + "_"
              )
            : this.schemaGenerator(
                output,
                apiType + item + "List",
                null,
                apiType + "_"
              );
          if (objecTypename === "object") {
            this.schemaObject[schemaName]["properties"][item]["$ref"] =
              "#/components/schemas/" + apiType + item + "List";
          } else {
            this.schemaObject[schemaName]["properties"][item]["items"] = {};
            this.schemaObject[schemaName]["properties"][item]["items"]["$ref"] =
              "#/components/schemas/" + apiType + item + "List";
          }
          // this.schemaObject[schemaName]['properties'][item]['$ref'] = '#/components/schemas/' + item
        } else {
          this.schemaObject[schemaName]["properties"][item]["type"] = "array";
          this.schemaObject[schemaName]["properties"][item]["items"] = {
            type: objecTypename
          };
        }
      } else {
        if (typeof responseData[item] === "object") {
          responseData[item] = responseData[item] + "";
        }
        this.schemaObject[schemaName]["properties"][item] = {
          type: typeof responseData[item],
          example: responseData[item]
        };
      }
    });
  };

  setResponseData = data => {
    if (data) {
      console.log(data)
      data = data.replace(/(\r\n|\n|\r)/gm, "");
      data = data.replace(/\s+/g, " ");
      try {
        let x = JSON.parse(data);
        console.log(x);
        this.setState({ response: JSON.parse(data) });
      } catch (err) {
        console.log(err)
        console.log(this.setState({ response: "" }));
      }
    } else {
      this.setState({ response: "" });
    }
  };

  setReqBodyData = data => {
    if (data) {
      data = data.replace(/(\r\n|\n|\r)/gm, "");
      data = data.replace(/\s+/g, " ");
      try {
        let x = JSON.parse(data);
        console.log(x);
        this.setState({ requestBody: JSON.parse(data) });
      } catch (err) {
        console.log(this.setState({ requestBody: "" }));
      }
    } else {
      this.setState({ requestBody: "" });
    }
  };

  render() {
    return (
      <Container>
        <Row>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <div className="block">
              <label>API</label>
              <input
                type="text"
                value={this.state.apiRequest}
                onChange={e => this.setState({ apiRequest: e.target.value })}
                className="form-control"
                placeholder="Ex: http://api.com/users/1?pageLen=100"
              />
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <div className="block">
              <label>Server Name</label>
              <input
                type="text"
                value={this.state.serverUrl}
                onChange={e => this.setState({ serverUrl: e.target.value })}
                className="form-control"
                placeholder="Ex: http://api.com"
              />
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <div className="block apiRequestType">
              <label>Request Type</label>
              <Dropdown as={ButtonGroup}>
                <Button className="dropdownMenu" variant="outline-dark">
                  {this.state.requestType}
                </Button>

                <Dropdown.Toggle
                  split
                  variant="outline-dark"
                  className="dropdownMenu"
                  id="dropdown-split-basic"
                />

                <Dropdown.Menu className="dropdownMenuItem">
                  <Dropdown.Item
                    active={this.state.requestType === "GET"}
                    onSelect={e => this.setState({ requestType: "GET" })}
                  >
                    GET
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={this.state.requestType === "POST"}
                    onSelect={e =>
                      this.setState({
                        requestType: "POST",
                        parseRequestBodyObject: true
                      })
                    }
                  >
                    POST
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={this.state.requestType === "DELETE"}
                    onSelect={e => this.setState({ requestType: "DELETE" })}
                  >
                    DELETE
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <div className="block">
              <label>Path param?</label>
              <Dropdown as={ButtonGroup}>
                <Button className="dropdownMenu" variant="outline-dark">
                  {(this.state.pathParamAvailable + "").toUpperCase()}
                </Button>

                <Dropdown.Toggle
                  split
                  variant="outline-dark"
                  className="dropdownMenu"
                  id="dropdown-split-basic"
                />

                <Dropdown.Menu className="dropdownMenuItem">
                  <Dropdown.Item
                    active={this.state.pathParamAvailable === true}
                    onSelect={e => this.setState({ pathParamAvailable: true })}
                  >
                    True
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={this.state.pathParamAvailable === false}
                    onSelect={e => this.setState({ pathParamAvailable: false })}
                  >
                    False
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <span
                className="addParam"
                onClick={() =>
                  this.changePathParamName(null, null, null, "add")
                }
              >
                {this.state.pathParamAvailable ? "+ Add param" : ""}
              </span>
            </div>
          </Col>
        </Row>
        <Row>{this.renderPathparamData()}</Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <div className="block">
              <label>Parse Response?</label>
              <Dropdown as={ButtonGroup}>
                <Button className="dropdownMenu" variant="outline-dark">
                  {(this.state.parseResponse + "").toUpperCase()}
                </Button>

                <Dropdown.Toggle
                  split
                  variant="outline-dark"
                  className="dropdownMenu"
                  id="dropdown-split-basic"
                />

                <Dropdown.Menu className="dropdownMenuItem">
                  <Dropdown.Item
                    active={this.state.parseResponse === true}
                    onSelect={e => this.setState({ parseResponse: true })}
                  >
                    True
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={this.state.parseResponse === false}
                    onSelect={e => this.setState({ parseResponse: false })}
                  >
                    False
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <div className="block">
              <label>Parse Request Body?</label>
              <Dropdown as={ButtonGroup}>
                <Button className="dropdownMenu" variant="outline-dark">
                  {(this.state.parseRequestBodyObject + "").toUpperCase()}
                </Button>

                <Dropdown.Toggle
                  split
                  variant="outline-dark"
                  className="dropdownMenu"
                  id="dropdown-split-basic"
                />

                <Dropdown.Menu className="dropdownMenuItem">
                  <Dropdown.Item
                    active={this.state.parseRequestBodyObject === true}
                    onSelect={e =>
                      this.setState({ parseRequestBodyObject: true })
                    }
                  >
                    True
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={this.state.parseRequestBodyObject === false}
                    onSelect={e =>
                      this.setState({ parseRequestBodyObject: false })
                    }
                  >
                    False
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            {this.state.parseResponse && (
              <div className="block">
                <textarea
                  type="text"
                  rows="10"
                  cols="10"
                  value={this.state.response}
                  onChange={
                    e => this.setResponseData(e.target.value)
                    /* this.setState({
                      response: e.target.value
                    }) */
                  }
                  className="form-control"
                  placeholder="Response Data"
                />
              </div>
            )}
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            {this.state.parseRequestBodyObject && (
              <div className="block">
                <textarea
                  type="text"
                  rows="10"
                  cols="10"
                  value={this.state.requestBody}
                  onChange={e => this.setReqBodyData(e.target.value)}
                  className="form-control"
                  placeholder="Request Body Data"
                />
              </div>
            )}
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            {this.state.parseResponse && (
              <div className="block">
                <label>Response Code</label>
                <input
                  type="text"
                  value={this.state.responseCode}
                  onChange={e =>
                    this.setState({ responseCode: e.target.value })
                  }
                  className="form-control"
                  placeholder="200"
                />
              </div>
            )}
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <div className="block">
              <label>Tags</label>
              <input
                type="text"
                value={this.state.tags}
                onChange={e => this.setState({ tags: e.target.value })}
                className="form-control"
                placeholder="iop,oc,vp"
              />
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <div className="block">
              <Button
                className="generateButton"
                variant="dark"
                onClick={e => this.generateSpec()}
              >
                GENERATE SCHEMA
              </Button>
              <Button
                className="generateButton"
                variant="dark"
                onClick={e => this.setState({ outputOpenAPISchema: "" })}
              >
                CLEAR
              </Button>
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="block">
              <textarea
                type="text"
                rows="20"
                cols="10"
                value={this.state.outputOpenAPISchema}
                className="form-control"
                placeholder="Open API Spdec"
                readOnly
              />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
