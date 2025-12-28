package BlueMoon.example.BlueMoon.service;

import BlueMoon.example.BlueMoon.dto.request.account.CreateAccountRequest;
import BlueMoon.example.BlueMoon.dto.request.account.UpdateAccountRequest;
import BlueMoon.example.BlueMoon.dto.response.account.AccountDTO;

import java.util.List;

public interface AccountService {
    List<AccountDTO> getAllAccounts();
    List<AccountDTO> searchAccounts(String query, String role);
    AccountDTO getAccountById(Long id);
    AccountDTO createAccount(CreateAccountRequest request);
    AccountDTO updateAccount(Long id, UpdateAccountRequest request);
    void deleteAccount(Long id);
}
