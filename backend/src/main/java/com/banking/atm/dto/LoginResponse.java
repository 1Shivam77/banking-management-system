package com.banking.atm.dto;

public class LoginResponse {
    private String token;
    private String cardNumber;
    private String name;

    public LoginResponse(String token, String cardNumber, String name) {
        this.token = token;
        this.cardNumber = cardNumber;
        this.name = name;
    }

    public String getToken() { return token; }
    public String getCardNumber() { return cardNumber; }
    public String getName() { return name; }
}
