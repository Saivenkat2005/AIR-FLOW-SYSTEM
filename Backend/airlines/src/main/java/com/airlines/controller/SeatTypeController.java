package com.airlines.controller;

import org.springframework.web.bind.annotation.*;

import com.airlines.dto.SeatTypeDTO;
import com.airlines.entity.SeatDetails;
import com.airlines.service.SeatTypeService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/seat")
@CrossOrigin("*")
public class SeatTypeController {
    private final SeatTypeService seatTypeService;

    public SeatTypeController(SeatTypeService seatTypeService) {
        this.seatTypeService = seatTypeService;
    }

    @PostMapping("/add")
    public SeatDetails insertSeat(@Valid @RequestBody SeatDetails seatDetails) {
        return seatTypeService.insertSeat(seatDetails);
    }

    @GetMapping("/get/{id}")
    public SeatDetails getSeatDetailsById(@PathVariable("id") Long seatId) {
        return seatTypeService.getSeatDetailsById(seatId);
    }

    @GetMapping("/get")
    public List<SeatDetails> getAllSeatDetails() {
        return seatTypeService.getAllSeatDetails();
    }

    @PutMapping("/update")
    public SeatDetails updateSeatById(@Valid @RequestBody SeatDetails seatDetails) {
        return seatTypeService.updateSeatById(seatDetails, seatDetails.getSeatId());
    }

    @DeleteMapping("/delete/{seatId}")
    public String deleteSeatDetailsById(@PathVariable("seatId") Long seatId) {
        seatTypeService.deleteSeatDetailsById(seatId);
        return "Seat detail deleted!";
    }

    @GetMapping("/getseats/{flightId}")
    public List<SeatTypeDTO> getSeatsByFlightId(@PathVariable("flightId") Long flightId){
        return seatTypeService.getSeatsByFlightId(flightId);
    }

    @PostMapping("/hold/{seatId}")
    public String holdSeat(@PathVariable("seatId") Long seatId, @RequestParam("userId") String userId) {
        boolean success = seatTypeService.holdSeat(seatId, userId);
        if (success) {
            return "Seat held successfully for 5 minutes.";
        }
        return "Seat is already held or unavailable.";
    }
}
