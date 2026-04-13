package com.banking.atm.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    // Global 2FA toggle — controlled by admin
    private volatile boolean enabled = true;

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    // Store OTP in memory per cardNumber for simplicity 
    // In production, this should be in Redis with an expiration time
    private final Map<String, String> otpStorage = new HashMap<>();

    public String generateOtp(String cardNumber) {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6 digit OTP
        String otpStr = String.valueOf(otp);
        otpStorage.put(cardNumber, otpStr);
        System.out.println("=========================================");
        System.out.println("2FA OTP Generated for " + cardNumber + ": " + otpStr);
        System.out.println("=========================================");
        return otpStr;
    }

    public boolean validateOtp(String cardNumber, String otp) {
        String storedOtp = otpStorage.get(cardNumber);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(cardNumber); // use once
            return true;
        }
        return false;
    }
    
    public void clearOtp(String cardNumber) {
        otpStorage.remove(cardNumber);
    }
}
