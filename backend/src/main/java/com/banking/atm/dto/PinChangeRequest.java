package com.banking.atm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class PinChangeRequest {

    @NotBlank(message = "Old PIN is required")
    @Pattern(regexp = "\\d{4}", message = "Old PIN must be exactly 4 digits")
    private String oldPin;

    @NotBlank(message = "New PIN is required")
    @Pattern(regexp = "\\d{4}", message = "New PIN must be exactly 4 digits")
    private String newPin;

    @NotBlank(message = "Confirmation PIN is required")
    @Pattern(regexp = "\\d{4}", message = "Confirmation PIN must be exactly 4 digits")
    private String confirmPin;

    public String getOldPin() { return oldPin; }
    public void setOldPin(String oldPin) { this.oldPin = oldPin; }

    public String getNewPin() { return newPin; }
    public void setNewPin(String newPin) { this.newPin = newPin; }

    public String getConfirmPin() { return confirmPin; }
    public void setConfirmPin(String confirmPin) { this.confirmPin = confirmPin; }
}
