package BlueMoon.example.BlueMoon.service.impl;

import BlueMoon.example.BlueMoon.dto.request.account.CreateAccountRequest;
import BlueMoon.example.BlueMoon.dto.request.account.UpdateAccountRequest;
import BlueMoon.example.BlueMoon.dto.response.account.AccountDTO;
import BlueMoon.example.BlueMoon.entity.AccountEntity;
import BlueMoon.example.BlueMoon.repository.AccountRepository;
import BlueMoon.example.BlueMoon.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccountDTO> searchAccounts(String query, String role) {
        String roleParam = (role == null || "ALL".equalsIgnoreCase(role)) ? null : role.toLowerCase();
        String queryParam = (query == null || query.trim().isEmpty()) ? null : "%" + query.trim().toLowerCase() + "%";
        
        return accountRepository.searchAccounts(queryParam, roleParam).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDTO getAccountById(Long id) {
        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với ID: " + id));
        return mapToDTO(account);
    }

    @Override
    public AccountDTO createAccount(CreateAccountRequest request) {
        if (accountRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại.");
        }

        AccountEntity account = new AccountEntity();
        account.setUsername(request.getUsername());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRole(request.getRole());
        account.setPhone(request.getPhone());

        return mapToDTO(accountRepository.save(account));
    }

    @Override
    public AccountDTO updateAccount(Long id, UpdateAccountRequest request) {
        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với ID: " + id));

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            account.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        account.setRole(request.getRole());
        account.setPhone(request.getPhone());

        return mapToDTO(accountRepository.save(account));
    }

    @Override
    public void deleteAccount(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy tài khoản với ID: " + id);
        }
        accountRepository.deleteById(id);
    }

    private AccountDTO mapToDTO(AccountEntity account) {
        return AccountDTO.builder()
                .accountId(account.getAccountId())
                .username(account.getUsername())
                .role(account.getRole())
                .phone(account.getPhone())
                .lastLogin(account.getLastLogin())
                .build();
    }
}
