package com.banking.atm.dto;

public class RegisterResponse {
    private String cardNumber;
    private String pin;
    private String message;

    public RegisterResponse(String cardNumber, String pin, String message) {
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.message = message;
    }

    public String getCardNumber() { return cardNumber; }
    public String getPin() { return pin; }
    public String getMessage() { return message; }
}
