// In node/jest env, the global request class isn't defined with the apis we have access to in the browser.
// By stubbing a minimal Request and Response to global, our API handlers can accept and read `request.url` or `response.json` just as they would in production.

// @ts-ignore
global.Request = class {
  url: string;
  constructor(input: string) {
    this.url = input;
  }
};

// @ts-ignore
global.Response = class {
  static json(body: any) {
    return {
      json: async () => body,
    };
  }
};
