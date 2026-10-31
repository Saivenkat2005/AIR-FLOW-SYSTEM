package com.airlines.service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.io.File;
@Service
public class TicketEmailService {
    @Autowired private JavaMailSender mailSender;
    public void sendTicketEmail(String recipient, String passengerName, String pnr, String flightNumber,
                                String origin, String destination, String departureTime, File pdfFile) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(recipient);
            helper.setSubject("Airline Nexus - Booking Confirmed | PNR " + pnr);
            helper.setText("Hello " + passengerName + ",\n\n" +
                    "Your Airline Nexus flight booking is confirmed.\n\n" +
                    "PNR: " + pnr + "\n" +
                    "Flight: " + flightNumber + "\n" +
                    "From: " + origin + "\n" +
                    "To: " + destination + "\n" +
                    "Departure: " + departureTime + "\n\n" +
                    "Your official e-ticket is attached.\n\n" +
                    "Thank you for choosing Airline Nexus.");
            if (pdfFile != null && pdfFile.exists()) {
                helper.addAttachment("Airline-Nexus-Ticket-" + pnr + ".pdf", pdfFile);
            }
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}