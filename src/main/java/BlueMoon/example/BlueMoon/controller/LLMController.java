package BlueMoon.example.BlueMoon.controller;

import BlueMoon.example.BlueMoon.service.LLMService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.MediaType;
import reactor.core.publisher.Flux;

@RestController
public class LLMController {

    private final LLMService llmService = new LLMService();

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> getLLMResponse(@RequestParam String prompt) {
        return llmService.getLLMStreamResponse(prompt);
    }
}