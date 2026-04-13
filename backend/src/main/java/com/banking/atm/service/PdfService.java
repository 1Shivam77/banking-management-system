package com.banking.atm.service;

import com.banking.atm.dto.TransactionDto;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.awt.Color;

@Service
public class PdfService {

    public byte[] generateStatement(Map<String, Object> statementData) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            fontTitle.setSize(20);
            Paragraph title = new Paragraph("SecureBank Account Statement", fontTitle);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);
            
            document.add(new Paragraph("\n"));
            
            Font fontText = FontFactory.getFont(FontFactory.HELVETICA);
            fontText.setSize(12);
            
            document.add(new Paragraph("Account Holder: " + statementData.get("name"), fontText));
            document.add(new Paragraph("Card Number: " + statementData.get("cardNumber"), fontText));
            document.add(new Paragraph("Current Balance: INR " + statementData.get("balance"), fontText));
            
            document.add(new Paragraph("\n"));
            
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[] {1.5f, 3f, 3f, 2.5f});
            table.setSpacingBefore(10);
            
            PdfPCell cell = new PdfPCell();
            cell.setPadding(5);
            
            Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            fontHeader.setColor(Color.WHITE);
            cell.setBackgroundColor(new Color(15, 23, 42)); // navy-900

            cell.setPhrase(new Phrase("ID", fontHeader));
            table.addCell(cell);
            
            cell.setPhrase(new Phrase("Date & Time", fontHeader));
            table.addCell(cell);
            
            cell.setPhrase(new Phrase("Type", fontHeader));
            table.addCell(cell);
            
            cell.setPhrase(new Phrase("Amount (INR)", fontHeader));
            table.addCell(cell);

            @SuppressWarnings("unchecked")
            List<TransactionDto> transactions = (List<TransactionDto>) statementData.get("transactions");
            for (TransactionDto tx : transactions) {
                table.addCell(String.valueOf(tx.getId()));
                table.addCell(tx.getTimestamp().toString());
                table.addCell(tx.getType());
                table.addCell(tx.getAmount().toString());
            }

            document.add(table);
            document.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return out.toByteArray();
    }
}
