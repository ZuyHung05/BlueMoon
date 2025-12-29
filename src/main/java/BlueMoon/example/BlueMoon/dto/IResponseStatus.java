package BlueMoon.example.BlueMoon.dto;

public interface IResponseStatus {
    String message();

    String messageCode();

    default IResponseStatus setMessage(String message) {
        return null;
    }
}
