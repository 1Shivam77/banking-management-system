package com.banking.atm.config;

import com.banking.atm.model.Account;
import com.banking.atm.model.Role;
import com.banking.atm.model.User;
import com.banking.atm.repository.AccountRepository;
import com.banking.atm.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.security.SecureRandom;

import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom random = new SecureRandom();

    public DataSeeder(UserRepository userRepository, AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println("=========================================");
        System.out.println("       SEEDING DATABASE...");
        System.out.println("=========================================");

        // 1. Super Admin
        if (!userRepository.existsByEmail("admin@securebank.com")) {
            User admin = new User();
            admin.setName("Super Admin");
            admin.setEmail("admin@securebank.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setIsActive(true);
            userRepository.save(admin);
            System.out.println("Seeded ADMIN: admin@securebank.com / admin123");
        }

        // 2. Dummy Bihari users with fixed card numbers
        seedUser("Rajesh Kumar Mishra", "Shiv Narayan Mishra", "1995-03-15", "Male",
                "rajesh.mishra@gmail.com", "Single", "Boring Road, Patna", "Patna", "800001", "Bihar",
                "Hindu", "General", "5-10 Lakh", "B.Tech", "Software Engineer",
                "ABCPM1234K", "123456789012", false,
                "4001100120013001", "1234", new BigDecimal("75000"));

        seedUser("Priya Kumari Singh", "Ram Pravesh Singh", "1998-07-22", "Female",
                "priya.singh@gmail.com", "Single", "Kankarbagh, Patna", "Patna", "800020", "Bihar",
                "Hindu", "OBC", "3-5 Lakh", "MBA", "Bank Manager",
                "DEFPS5678L", "234567890123", false,
                "4002200220023002", "5678", new BigDecimal("120000"));

        seedUser("Amit Kumar Yadav", "Lalan Yadav", "1990-11-05", "Male",
                "amit.yadav@gmail.com", "Married", "Station Road, Muzaffarpur", "Muzaffarpur", "842001", "Bihar",
                "Hindu", "OBC", "2-3 Lakh", "B.Com", "Shopkeeper",
                "GHIAY9012M", "345678901234", false,
                "4003300330033003", "9012", new BigDecimal("45000"));

        seedUser("Sneha Devi Jha", "Umesh Jha", "1985-01-30", "Female",
                "sneha.jha@gmail.com", "Married", "Bhagalpur Road, Bhagalpur", "Bhagalpur", "812001", "Bihar",
                "Hindu", "General", "10+ Lakh", "M.Sc", "College Professor",
                "JKLSJ3456N", "456789012345", true,
                "4004400440044004", "3456", new BigDecimal("200000"));

        System.out.println("=========================================");
        System.out.println("       SEEDING COMPLETE!");
        System.out.println("=========================================");
    }

    private void seedUser(String name, String fathersName, String dob, String gender,
                          String email, String maritalStatus, String address, String city,
                          String pinCode, String state, String religion, String category,
                          String income, String education, String occupation,
                          String pan, String aadhaar, boolean seniorCitizen,
                          String cardNumber, String rawPin, BigDecimal balance) {
        if (userRepository.existsByEmail(email)) return;

        User user = new User();
        user.setName(name);
        user.setFathersName(fathersName);
        user.setDateOfBirth(LocalDate.parse(dob));
        user.setGender(gender);
        user.setEmail(email);
        user.setMaritalStatus(maritalStatus);
        user.setAddress(address);
        user.setCity(city);
        user.setPinCode(pinCode);
        user.setState(state);
        user.setReligion(religion);
        user.setCategory(category);
        user.setIncome(income);
        user.setEducation(education);
        user.setOccupation(occupation);
        user.setPan(pan);
        user.setAadhaar(aadhaar);
        user.setSeniorCitizen(seniorCitizen);
        user.setIsActive(true);
        userRepository.save(user);

        Account account = new Account();
        account.setAccountNumber(generateAccountNumber());
        account.setCardNumber(cardNumber);
        account.setPinHash(passwordEncoder.encode(rawPin));
        account.setBalance(balance);
        account.setUser(user);
        account.setAccountType("Savings");
        accountRepository.save(account);

        System.out.println("Seeded: " + name + " | Card: " + cardNumber + " | PIN: " + rawPin);
    }

    private String generateAccountNumber() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
