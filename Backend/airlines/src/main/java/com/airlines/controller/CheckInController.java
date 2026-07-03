package com.airlines.controller;

import com.airlines.entity.ManifestRecord;
import com.airlines.handlers.OverbookedException;
import com.airlines.service.CheckInService;
import com.airlines.service.OverbookingResolutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkin")
public class CheckInController {

    @Autowired
    private CheckInService checkInService;

    @Autowired
    private OverbookingResolutionService overbookingResolutionService;

    @PostMapping("/{bookingId}")
    public ResponseEntity<?> checkIn(@PathVariable Long bookingId) throws com.airlines.handlers.ResourceNotAvailableException {
        try {
            ManifestRecord record = checkInService.checkInPassenger(bookingId);
            return ResponseEntity.ok(record);
        } catch (OverbookedException e) {
            ManifestRecord resolvedRecord = overbookingResolutionService.resolveOverbooking(bookingId);
            return ResponseEntity.ok("Overbooking resolved via " + resolvedRecord.getStatus() + ". New record: " + resolvedRecord.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
