package com.airlines.service;

import com.airlines.entity.ManifestRecord;

import com.airlines.handlers.ResourceNotAvailableException;

public interface CheckInService {
    ManifestRecord checkInPassenger(Long bookingId) throws ResourceNotAvailableException;
}
