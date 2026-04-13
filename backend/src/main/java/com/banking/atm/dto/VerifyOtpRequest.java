package com.banking.atm.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyOtpRequest {
    @NotBlank(message = "Card number is required")
    private String cardNumber;
    
    @NotBlank(message = "OTP is required")
    private String otp;

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
    
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
