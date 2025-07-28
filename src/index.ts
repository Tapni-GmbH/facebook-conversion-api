import {
  EventRequest,
  CustomData,
  UserData,
  Content,
  ServerEvent,
} from 'facebook-nodejs-business-sdk';

class FacebookConversionAPI {
  private accessToken: string;

  private pixelId: string;

  private fbp: string | null;

  private fbc: string | null;

  private userData: UserData;

  private contents: Content[];

  private debug: boolean;

  /**
   * Constructor.
   *
   * @param accessToken
   * @param pixelId
   * @param emails
   * @param phones
   * @param clientIpAddress
   * @param clientUserAgent
   * @param fbp
   * @param fbc
   * @param debug
   */
  constructor(
    accessToken: string, pixelId: string, emails: Array<string>|null,
    phones: Array<string>|null, clientIpAddress: string, clientUserAgent: string,
    fbp: string | null, fbc: string | null, debug: boolean = false,
  ) {
    this.accessToken = accessToken;
    this.pixelId = pixelId;
    this.fbp = fbp;
    this.fbc = fbc;
    this.debug = debug;
    this.userData = (new UserData())
      .setEmails(emails)
      .setPhones(phones)
      .setClientIpAddress(clientIpAddress)
      .setClientUserAgent(clientUserAgent)
      .setFbp(fbp)
      .setFbc(fbc);
    this.contents = [];

    if (this.debug) {
      console.log(`User Data: ${JSON.stringify(this.userData)}\n`);
    }
  }

  /**
   * Add product to contents array.
   *
   * @param sku
   * @param quantity
   */
  addProduct(sku: string, quantity: number): void {
    this.contents.push(new Content().setId(sku).setQuantity(quantity));

    if (this.debug) {
      console.log(`Add To Cart: ${JSON.stringify(this.contents)}\n`);
    }
  }

  /**
   * Send event to Facebook Conversion API and clear contents array after event is fired.
   *
   * @param eventName
   * @param sourceUrl
   * @param purchaseData
   * @param eventData
   */
  async sendEvent(
    eventName: string,
    sourceUrl: string,
    purchaseData?: { value?: number; currency?: string },
    eventData?: { eventId?: string },
  ): Promise<unknown> {
    const eventRequest = new EventRequest(this.accessToken, this.pixelId)
      .setEvents([this.#getEventData(eventName, sourceUrl, purchaseData, eventData)]);

    this.contents = [];

    if (this.debug) {
      console.log(`Event Request: ${JSON.stringify(eventRequest)}\n`);
    }

    return eventRequest.execute();
  }

  /**
   * Get event data.
   *
   * @param eventName
   * @param sourceUrl
   * @param purchaseData
   * @param eventData
   */
  #getEventData(
    eventName: string,
    sourceUrl: string,
    purchaseData?: { value?: number; currency?: string },
    eventData?: { eventId?: string },
  ): ServerEvent {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    return new ServerEvent()
      .setEventName(eventName)
      .setEventTime(currentTimestamp)
      .setEventId(eventData?.eventId)
      .setUserData(this.userData)
      .setCustomData(new CustomData()
        .setContents(this.contents)
        .setCurrency(purchaseData?.currency)
        .setValue(purchaseData?.value))
      .setEventSourceUrl(sourceUrl)
      .setActionSource('website');
  }
}

export default FacebookConversionAPI;
