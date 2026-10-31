package com.airlines.controller;

import com.airlines.service.PixabayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/backgrounds", "/api/backgrounds", "/api/v1/media/aviation-backgrounds"})
@CrossOrigin("*")
public class PixabayController {

    private final PixabayService pixabayService;

    public PixabayController(PixabayService pixabayService) {
        this.pixabayService = pixabayService;
    }

    @GetMapping
    public ResponseEntity<List<String>> getBackgrounds(
            @RequestParam(defaultValue = "aviation") String category,
            @RequestParam(defaultValue = "horizontal") String orientation,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "15") int limit) {
        List<String> images = pixabayService.getBackgroundsByCategory(category);
        return ResponseEntity.ok(images);
    }

    @GetMapping("/structured")
    public ResponseEntity<Map<String, Object>> getStructuredBackgrounds(
            @RequestParam(defaultValue = "aviation") String category) {
        List<String> images = pixabayService.getBackgroundsByCategory(category);
        Map<String, Object> response = new HashMap<>();
        response.put("category", category);
        response.put("source", "pixabay-media-service");
        response.put("images", images);
        response.put("total", images.size());
        return ResponseEntity.ok(response);
    }
}
