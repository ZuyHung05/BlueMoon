package BlueMoon.example.BlueMoon.enums;

import BlueMoon.example.BlueMoon.dto.IResponseStatus;

public enum SuccessCode implements IResponseStatus {
    SUCCESS("Success");

    private String message;

    SuccessCode(String message) {
        this.message = message;
    }

    @Override
    public String message() {
        return this.message;
    }

    @Override
    public String messageCode() {
        return this.name();
    }

    @Override
    public IResponseStatus setMessage(String message) {
        this.message = message;
        return this;
    }
}
