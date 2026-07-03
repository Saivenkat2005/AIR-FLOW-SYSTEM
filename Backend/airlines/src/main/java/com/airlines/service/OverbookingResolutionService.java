package com.airlines.service;

import com.airlines.entity.ManifestRecord;

import com.airlines.handlers.ResourceNotAvailableException;

public interface OverbookingResolutionService {
    ManifestRecord resolveOverbooking(Long bookingId) throws ResourceNotAvailableException;
}
