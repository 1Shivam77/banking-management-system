package com.banking.atm.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class TransferRequest {

    @NotBlank(message = "Target Card Number is required")
    private String targetCardNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Minimum transfer amount is 1")
    private BigDecimal amount;

    public String getTargetCardNumber() { return targetCardNumber; }
    public void setTargetCardNumber(String targetCardNumber) { this.targetCardNumber = targetCardNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
