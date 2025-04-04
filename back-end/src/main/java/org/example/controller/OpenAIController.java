package org.example.controller;

import org.example.service.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/openai")
@CrossOrigin
public class OpenAIController {

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/fetch-response")
    public String fetchAIResponse(@RequestBody String prompt) {
        return openAIService.fetchAIResponse(prompt);
    }
}
