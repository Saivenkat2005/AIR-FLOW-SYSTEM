package com.airlines.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PixabayService {

    @Value("${pixabay.api.key:}")
    private String apiKey;

    private final String PIXABAY_API_URL = "https://pixabay.com/api/?key={key}&q={query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=15";
    
    private final RestTemplate restTemplate;
    
    // Simple Cache: Category Query -> List of Image URLs
    private final Map<String, CacheEntry> imageCache = new ConcurrentHashMap<>();
    private static final long CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

    public PixabayService() {
        this.restTemplate = new RestTemplate();
    }

    public List<String> getBackgroundsByCategory(String category) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return Collections.emptyList(); // Graceful fallback
        }

        String query = category.replace(" ", "+");
        
        CacheEntry entry = imageCache.get(query);
        if (entry != null && (System.currentTimeMillis() - entry.timestamp < CACHE_TTL_MS)) {
            return entry.imageUrls;
        }

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(
                PIXABAY_API_URL.replace("{key}", apiKey).replace("{query}", query), 
                Map.class
            );

            if (response != null && response.containsKey("hits")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> hits = (List<Map<String, Object>>) response.get("hits");
                List<String> urls = new ArrayList<>();
                for (Map<String, Object> hit : hits) {
                    if (hit.containsKey("largeImageURL")) {
                        urls.add((String) hit.get("largeImageURL"));
                    }
                }
                
                if (!urls.isEmpty()) {
                    Collections.shuffle(urls); // Randomize rotation order
                    imageCache.put(query, new CacheEntry(urls, System.currentTimeMillis()));
                    return urls;
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch Pixabay images: " + e.getMessage());
        }

        return Collections.emptyList();
    }

    private static class CacheEntry {
        List<String> imageUrls;
        long timestamp;

        CacheEntry(List<String> imageUrls, long timestamp) {
            this.imageUrls = imageUrls;
            this.timestamp = timestamp;
        }
    }
}
