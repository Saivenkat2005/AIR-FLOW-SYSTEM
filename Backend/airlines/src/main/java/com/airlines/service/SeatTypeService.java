package com.airlines.service;

import java.util.List;

import com.airlines.dto.SeatTypeDTO;
import com.airlines.entity.SeatDetails;

public interface SeatTypeService {

    public SeatDetails getSeatDetailsById(Long seatId);

    public SeatDetails insertSeat(SeatDetails seatDetails);

    public List<SeatDetails> getAllSeatDetails();

    public SeatDetails updateSeatById(SeatDetails seatDetails, Long seatId);

    public void deleteSeatDetailsById(Long seatId);

    public List<SeatTypeDTO> getSeatsByFlightId(Long flightId);

    public boolean holdSeat(Long seatId, String userId);
}
