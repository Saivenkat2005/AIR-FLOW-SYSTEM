package com.airlines.service;
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
}