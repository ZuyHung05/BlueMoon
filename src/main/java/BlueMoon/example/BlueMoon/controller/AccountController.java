package BlueMoon.example.BlueMoon.controller;

import BlueMoon.example.BlueMoon.dto.request.account.CreateAccountRequest;
import BlueMoon.example.BlueMoon.dto.request.account.UpdateAccountRequest;
import BlueMoon.example.BlueMoon.dto.response.ApiResponse;
import BlueMoon.example.BlueMoon.dto.response.account.AccountDTO;
import BlueMoon.example.BlueMoon.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountDTO>>> getAllAccounts() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài khoản thành công", accountService.getAllAccounts()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<AccountDTO>>> searchAccounts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm tài khoản thành công", accountService.searchAccounts(query, role)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDTO>> getAccountById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin tài khoản thành công", accountService.getAccountById(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountDTO>> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Tạo tài khoản thành công", accountService.createAccount(request)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDTO>> updateAccount(@PathVariable Long id, @Valid @RequestBody UpdateAccountRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Cập nhật tài khoản thành công", accountService.updateAccount(id, request)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable Long id) {
        try {
            accountService.deleteAccount(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa tài khoản thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
