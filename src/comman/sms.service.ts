import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class smsService {
    constructor(private httpservice: HttpService,) {

    }
    baseURL = 'https://k2vlwe.api.infobip.com'
    apikey = "App 84707160c8f22a7563bd61777784ce32-95382c75-3c55-4385-9c0d-f918b9b102b3"
    headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        "Accept": "application/json",
        "Authorization": this.apikey,
    };
    // https://k2vlwe.api.infobip.com/sms/2/text/advanced
    async sentSMS(data, otp) {
        try {
            const body = JSON.stringify({
                "messages": [
                    {
                        "destinations": [{ "to": `91${data?.mobileNo}` }],
                        "from": "ServiceSMS",
                        "text": `Hello ${data?.displayName},\n\nThis is Your OTP\n ${otp} \n Have a nice day!`
                    }
                ]

            })
            const userData: any = await firstValueFrom(
                this.httpservice.post(
                    `${this.baseURL}/sms/2/text/advanced`,
                    body,
                    { headers: this.headersRequest }
                ),
            );
            if (userData?.data && userData?.data?.messages && userData?.data?.messages.length > 0) {

                return true

            }
            else { return false }
        } catch (e) {
            throw new HttpException(
                { success: false, message: e?.message },
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}