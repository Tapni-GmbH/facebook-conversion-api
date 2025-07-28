declare module 'facebook-nodejs-business-sdk' {
  export class EventRequest { constructor(accessToken: string, pixelId: string); [key: string]: any }
  export class CustomData { [key: string]: any }
  export class UserData { [key: string]: any }
  export class Content { [key: string]: any }
  export class ServerEvent { [key: string]: any }
  const sdk: any;
  export default sdk;
}
