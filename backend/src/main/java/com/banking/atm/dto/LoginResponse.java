package com.banking.atm.dto;

public class LoginResponse {
    private String token;
    private String cardNumber;
    private String name;
    private boolean requiresOtp;
    private String role;

    public LoginResponse(boolean requiresOtp, String message) {
        this.requiresOtp = requiresOtp;
        this.token = message; // Overloading token field to hold temp message
    }

    public LoginResponse(String token, String cardNumber, String name, String role) {
        this.token = token;
        this.cardNumber = cardNumber;
        this.name = name;
        this.role = role;
        this.requiresOtp = false;
    }

    public String getToken() { return token; }
    public String getCardNumber() { return cardNumber; }
    public String getName() { return name; }
    public boolean isRequiresOtp() { return requiresOtp; }
    public String getRole() { return role; }
}
