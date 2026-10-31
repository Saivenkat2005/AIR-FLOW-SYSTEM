const fs = require('fs');
const path = require('path');

const baseDir = "c:\\Resume\\ECommerce\\Airline-Booking 2 - Copy";
const backendDir = path.join(baseDir, "Backend", "airlines");
const javaDir = path.join(backendDir, "src", "main", "java", "com", "airlines");
const resDir = path.join(backendDir, "src", "main", "resources");

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 1. Email Service
const emailServicePath = path.join(javaDir, "service", "TicketEmailService.java");
fs.writeFileSync(emailServicePath, `package com.airlines.service;
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
            helper.setText("Hello " + passengerName + ",\\n\\n" +
                    "Your Airline Nexus flight booking is confirmed.\\n\\n" +
                    "PNR: " + pnr + "\\n" +
                    "Flight: " + flightNumber + "\\n" +
                    "From: " + origin + "\\n" +
                    "To: " + destination + "\\n" +
                    "Departure: " + departureTime + "\\n\\n" +
                    "Your official e-ticket is attached.\\n\\n" +
                    "Thank you for choosing Airline Nexus.");
            if (pdfFile != null && pdfFile.exists()) {
                helper.addAttachment("Airline-Nexus-Ticket-" + pnr + ".pdf", pdfFile);
            }
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`);

// 2. PDF Generator
const pdfServicePath = path.join(javaDir, "service", "PdfGeneratorService.java");
fs.writeFileSync(pdfServicePath, `package com.airlines.service;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.FileOutputStream;
@Service
public class PdfGeneratorService {
    public File generatePdfTicket(String passengerName, String pnr, String flightNumber,
                                  String origin, String destination, String departureTime, String seat, Long price) {
        File pdfFile = new File("ticket_" + pnr + ".pdf");
        try {
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
            document.open();
            document.add(new Paragraph("AIRLINE NEXUS - Electronic Flight Ticket"));
            document.add(new Paragraph("--------------------------------------------------"));
            document.add(new Paragraph("Passenger Name: " + passengerName));
            document.add(new Paragraph("PNR: " + pnr));
            document.add(new Paragraph("Flight Number: " + flightNumber));
            document.add(new Paragraph("Origin: " + origin));
            document.add(new Paragraph("Destination: " + destination));
            document.add(new Paragraph("Departure Time: " + departureTime));
            document.add(new Paragraph("Seat: " + seat));
            document.add(new Paragraph("Total Price: $" + price));
            document.add(new Paragraph("--------------------------------------------------"));
            document.close();
            return pdfFile;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}`);

// 3. Listener
const listenerPath = path.join(javaDir, "service", "BookingEmailListener.java");
fs.writeFileSync(listenerPath, `package com.airlines.service;
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
}`);
console.log("Email components created.");
