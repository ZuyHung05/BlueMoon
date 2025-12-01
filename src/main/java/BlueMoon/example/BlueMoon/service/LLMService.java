package BlueMoon.example.BlueMoon.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;

public class LLMService {
    public Flux<String> getLLMStreamResponse(String message) {

    return Flux.create(emitter -> {
        try {
            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("http://localhost:8000/stream"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString("{\"message\": \"" + message + "\"}"))
                    .build();

            client.sendAsync(request, HttpResponse.BodyHandlers.ofInputStream())
                    .thenAccept(response -> {
                        try (BufferedReader reader =
                                     new BufferedReader(new InputStreamReader(response.body()))) {

                            String chunk;
                            while ((chunk = reader.readLine()) != null) {
                                emitter.next(chunk);     // send chunk to curl or React
                            }
                            emitter.complete();

                        } catch (Exception e) {
                            emitter.error(e);
                        }
                    });

        } catch (Exception e) {
            emitter.error(e);
        }
    }, FluxSink.OverflowStrategy.BUFFER);
}
    
}
