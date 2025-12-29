package BlueMoon.example.BlueMoon.exception;

import BlueMoon.example.BlueMoon.dto.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;

@RestControllerAdvice // Annotation quan trọng để bắt lỗi toàn cục
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGeneral(Exception ex) {
        ApiResponse<?> api = ApiResponse.builder()
                .code(9999)
                .message("Lỗi hệ thống: " + ex.getMessage())
                .build();
        return ResponseEntity.badRequest().body(api);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<String> handlingValidation(MethodArgumentNotValidException exception){
        return ResponseEntity.badRequest().body(exception.getFieldError().getDefaultMessage());
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponse<?>> handleNotFound(NoSuchElementException ex) {

        ApiResponse<?> api = ApiResponse.builder()
                .code(1004)
                .message(ex.getMessage()) // “Mã hộ gia đình … không tồn tại”
                .build();

        return ResponseEntity.badRequest().body(api);
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<?>> handleSQL(DataIntegrityViolationException ex) {

        String message = "Dữ liệu không hợp lệ";

        Throwable root = ex.getRootCause();
        if (root != null && root.getMessage() != null) {
            String error = root.getMessage();

            if (error.contains("residents_phone_number_key")) {
                message = "Số điện thoại đã tồn tại!";
            } else if (error.contains("residents_id_number_key")) {
                message = "Số CCCD đã tồn tại!";
            } else if (error.contains("not-null")) {
                message = "Thiếu dữ liệu bắt buộc!";
            }
        }

        ApiResponse<?> response = ApiResponse.builder()
                .code(1001)
                .message(message)
                .result(null)
                .build();

        return ResponseEntity.badRequest().body(response);
    }

}
