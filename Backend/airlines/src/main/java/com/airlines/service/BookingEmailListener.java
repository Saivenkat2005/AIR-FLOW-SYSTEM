package com.airlines.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;
import java.io.File;
@Component
@EnableAsync
public class BookingEmailListener {
    @Autowired private TicketEmailService emailService;
    @Autowired private PdfGeneratorService pdfService;
    @Async
    public void processBookingEmail(String recipient, String passengerName, String pnr, String flightNumber,
                                    String origin, String destination, String departureTime, String seat, Long price) {
        File pdf = pdfService.generatePdfTicket(passengerName, pnr, flightNumber, origin, destination, departureTime, seat, price);
        emailService.sendTicketEmail(recipient, passengerName, pnr, flightNumber, origin, destination, departureTime, pdf);
        if (pdf != null && pdf.exists()) { pdf.delete(); }
    }
}