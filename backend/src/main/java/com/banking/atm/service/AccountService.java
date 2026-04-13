package com.banking.atm.service;

import com.banking.atm.dto.*;
import com.banking.atm.model.Account;
import com.banking.atm.model.Transaction;
import com.banking.atm.model.TransactionType;
import com.banking.atm.repository.AccountRepository;
import com.banking.atm.repository.TransactionRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(AccountRepository accountRepository,
                          TransactionRepository transactionRepository,
                          PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> getBalance(String cardNumber) {
        Account account = findByCardNumber(cardNumber);
        return Map.of(
                "balance", account.getBalance(),
                "cardNumber", account.getCardNumber(),
                "name", account.getUser().getName(),
                "accountType", account.getAccountType()
        );
    }

    @Transactional
    public Map<String, Object> deposit(String cardNumber, BigDecimal amount) {
        Account account = findByCardNumber(cardNumber);

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        recordTransaction(account, TransactionType.DEPOSIT, amount);

        return Map.of(
                "message", "Deposit successful",
                "deposited", amount,
                "balance", account.getBalance()
        );
    }

    @Transactional
    public Map<String, Object> withdraw(String cardNumber, BigDecimal amount) {
        Account account = findByCardNumber(cardNumber);

        if (account.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient Balance");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        recordTransaction(account, TransactionType.WITHDRAWAL, amount);

        return Map.of(
                "message", "Withdrawal successful",
                "withdrawn", amount,
                "balance", account.getBalance()
        );
    }

    @Transactional
    public Map<String, Object> fastCash(String cardNumber, BigDecimal amount) {
        Account account = findByCardNumber(cardNumber);

        if (account.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient Balance");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        recordTransaction(account, TransactionType.FAST_CASH, amount);

        return Map.of(
                "message", "Fast Cash withdrawal successful",
                "withdrawn", amount,
                "balance", account.getBalance()
        );
    }

    @Transactional
    public Map<String, Object> transfer(String sourceCard, String targetCard, BigDecimal amount) {
        if (sourceCard.equals(targetCard)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        Account sourceAccount = findByCardNumber(sourceCard);
        Account targetAccount = findByCardNumber(targetCard);

        if (sourceAccount.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient Balance for transfer");
        }

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(amount));
        accountRepository.save(sourceAccount);

        targetAccount.setBalance(targetAccount.getBalance().add(amount));
        accountRepository.save(targetAccount);

        recordTransaction(sourceAccount, TransactionType.TRANSFER_OUT, amount);
        recordTransaction(targetAccount, TransactionType.TRANSFER_IN, amount);

        return Map.of(
                "message", "Transfer successful",
                "transferred", amount,
                "balance", sourceAccount.getBalance()
        );
    }

    @Transactional
    public Map<String, String> changePin(String cardNumber, PinChangeRequest request) {
        Account account = findByCardNumber(cardNumber);

        if (!passwordEncoder.matches(request.getOldPin(), account.getPinHash())) {
            throw new IllegalArgumentException("Incorrect current PIN");
        }

        if (!request.getNewPin().equals(request.getConfirmPin())) {
            throw new IllegalArgumentException("New PIN and confirmation PIN do not match");
        }

        if (request.getOldPin().equals(request.getNewPin())) {
            throw new IllegalArgumentException("New PIN must be different from current PIN");
        }

        account.setPinHash(passwordEncoder.encode(request.getNewPin()));
        accountRepository.save(account);

        return Map.of("message", "PIN changed successfully");
    }

    public Map<String, Object> getMiniStatement(String cardNumber) {
        Account account = findByCardNumber(cardNumber);

        List<TransactionDto> transactions = transactionRepository
                .findTop10ByAccountIdOrderByTimestampDesc(account.getId())
                .stream()
                .map(t -> new TransactionDto(t.getId(), t.getTimestamp(), t.getType().name(), t.getAmount()))
                .collect(Collectors.toList());

        return Map.of(
                "cardNumber", account.getCardNumber(),
                "name", account.getUser().getName(),
                "balance", account.getBalance(),
                "transactions", transactions
        );
    }

    public Map<String, Object> getAnalytics(String cardNumber) {
        Account account = findByCardNumber(cardNumber);
        List<Transaction> transactions = transactionRepository.findTop50ByAccountIdOrderByTimestampDesc(account.getId());
        
        BigDecimal totalDeposits = transactions.stream()
            .filter(t -> t.getType() == TransactionType.DEPOSIT || t.getType() == TransactionType.TRANSFER_IN)
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        BigDecimal totalWithdrawals = transactions.stream()
            .filter(t -> t.getType() == TransactionType.WITHDRAWAL || t.getType() == TransactionType.FAST_CASH || t.getType() == TransactionType.TRANSFER_OUT)
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<TransactionDto> recentActivity = transactions.stream()
            .limit(10)
            .map(t -> new TransactionDto(t.getId(), t.getTimestamp(), t.getType().name(), t.getAmount()))
            .collect(Collectors.toList());

        return Map.of(
            "totalDeposits", totalDeposits,
            "totalWithdrawals", totalWithdrawals,
            "recentActivity", recentActivity
        );
    }

    private Account findByCardNumber(String cardNumber) {
        return accountRepository.findByCardNumber(cardNumber)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
    }

    private void recordTransaction(Account account, TransactionType type, BigDecimal amount) {
        Transaction tx = new Transaction();
        tx.setAccount(account);
        tx.setType(type);
        tx.setAmount(amount);
        tx.setTimestamp(LocalDateTime.now());
        transactionRepository.save(tx);
    }
}
