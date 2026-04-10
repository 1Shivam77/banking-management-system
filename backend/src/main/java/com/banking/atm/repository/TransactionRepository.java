package com.banking.atm.repository;

import com.banking.atm.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findTop10ByAccountIdOrderByTimestampDesc(Long accountId);
}
