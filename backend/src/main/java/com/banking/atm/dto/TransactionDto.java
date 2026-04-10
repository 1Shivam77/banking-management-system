package com.banking.atm.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionDto {
    private Long id;
    private LocalDateTime timestamp;
    private String type;
    private BigDecimal amount;

    public TransactionDto(Long id, LocalDateTime timestamp, String type, BigDecimal amount) {
        this.id = id;
        this.timestamp = timestamp;
        this.type = type;
        this.amount = amount;
    }

    public Long getId() { return id; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getType() { return type; }
    public BigDecimal getAmount() { return amount; }
}
