package BlueMoon.example.BlueMoon.dto;

import BlueMoon.example.BlueMoon.enums.SuccessCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BaseResponse implements Serializable {
    private String messageCode;
    private String message;
    private Object data;
    private Object optional;

    public static BaseResponse success(Object data) {
        return success(SuccessCode.SUCCESS.message(), data, null);
    }

    public static BaseResponse success(Object data, String message) {
        return success(message, data, null);
    }

    public static BaseResponse success(Object data, Object optional) {
        return success(SuccessCode.SUCCESS.message(), data, optional);
    }

    public static BaseResponse success(String message, Object data, Object optional) {
        return BaseResponse.builder()
                .messageCode(SuccessCode.SUCCESS.messageCode())
                .message(message)
                .data(data)
                .optional(optional)
                .build();
    }
}
