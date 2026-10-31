package com.airlines.service.impl;

import com.airlines.repository.SeatDetailsRepository;
import com.airlines.service.SeatTypeService;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;
import java.util.concurrent.TimeUnit;

import com.airlines.dto.SeatTypeDTO;
import com.airlines.entity.SeatDetails;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;

@Service
@SuppressWarnings("null")
public class SeatTypeServiceImpl implements SeatTypeService {
    private final SeatDetailsRepository seatDetailsRepository;
    
    @Autowired(required = false)
    private StringRedisTemplate redisTemplate;
    
    private final Map<String, String> inMemoryLock = new ConcurrentHashMap<>();

    public SeatTypeServiceImpl(SeatDetailsRepository seatDetailsRepository) {
        this.seatDetailsRepository = seatDetailsRepository;
    }

    @Override
    public SeatDetails getSeatDetailsById(Long id) {
        return seatDetailsRepository.findById(java.util.Objects.requireNonNull(id)).get();
    }

    @Override
    public SeatDetails insertSeat(SeatDetails seatDetails) {
        seatDetailsRepository.save(java.util.Objects.requireNonNull(seatDetails));
        return seatDetails;
    }

    @Override
    public List<SeatDetails> getAllSeatDetails() {
        return seatDetailsRepository.findAll();
    }

    @Override
    public SeatDetails updateSeatById(SeatDetails seatDetails, Long seatId) {
        SeatDetails seatDetailsDB = seatDetailsRepository.findById(java.util.Objects.requireNonNull(seatId)).get();
        if (Objects.nonNull(seatDetails.getSeatType()) && !"".equalsIgnoreCase(seatDetails.getSeatType()))
            seatDetailsDB.setSeatType(seatDetails.getSeatType());
        if (Objects.nonNull(seatDetails.getAvailableSeats()))
            seatDetailsDB.setAvailableSeats(seatDetails.getAvailableSeats());
        if (Objects.nonNull(seatDetails.getPrice()))
            seatDetailsDB.setPrice(seatDetails.getPrice());
        return seatDetailsRepository.save(java.util.Objects.requireNonNull(seatDetailsDB));
    }

    @Override
    public void deleteSeatDetailsById(Long seatId) {
        seatDetailsRepository.deleteById(java.util.Objects.requireNonNull(seatId));
    }

    @Override
    public List<SeatTypeDTO> getSeatsByFlightId(Long flightId) {
        List<SeatDetails> fetchedSeatDetails = seatDetailsRepository.getSeatDetailsByFlightId(flightId);
        List<SeatTypeDTO> seatTypeDTOList = new ArrayList<>();
        for (SeatDetails s : fetchedSeatDetails) {
            SeatTypeDTO seatTypeDTO = new SeatTypeDTO(s.getSeatId(), s.getFlightId(),s.getSeatType(), s.getAvailableSeats(), s.getPrice());
            seatTypeDTOList.add(seatTypeDTO);
        }
        return seatTypeDTOList;
    }

    public boolean holdSeat(Long seatId, String userId) {
        String key = "seat:hold:" + seatId;
        if (redisTemplate != null) {
            try {
                Boolean success = redisTemplate.opsForValue().setIfAbsent(key, userId, 5, TimeUnit.MINUTES);
                return Boolean.TRUE.equals(success);
            } catch (Exception e) {
                // Redis is down, fallback to in-memory
            }
        }
        
        // Fallback: In-memory lock (Not distributed, but allows local dev)
        return inMemoryLock.putIfAbsent(key, userId) == null;
    }
}
