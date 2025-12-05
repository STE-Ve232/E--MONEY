from config import Config
import random


class SMSStubProvider:
    def send_otp(self, phone, otp):
        print(f"[SMS-STUB] OTP for {phone} is {otp}")
        return True


def get_provider():
    if Config.SMS_PROVIDER == 'stub':
        return SMSStubProvider()
    # else implement Twilio, Africa's Talking, etc.


provider = get_provider()
