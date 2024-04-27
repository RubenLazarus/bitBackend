export interface IOTPService {
    generateOTP()
    createOTP(data);
    otpVerfications(data)
    sendOTP(data)
    OTPLessVerify(data)

}