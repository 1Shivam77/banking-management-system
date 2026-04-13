package com.banking.atm.repository;

import com.banking.atm.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByCardNumber(String cardNumber);
    boolean existsByCardNumber(String cardNumber);
    Optional<Account> findByUserId(Long userId);
}
