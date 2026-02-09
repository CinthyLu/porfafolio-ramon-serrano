package com.portfolio.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import com.portfolio.model.Advisory;
import com.portfolio.model.Project;
import com.portfolio.repository.AdvisoryRepository;
import com.portfolio.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final AdvisoryRepository advisoryRepository;
    private final ProjectRepository projectRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // ============ ADVISORY REPORTS ============

    public byte[] generateAdvisoriesPdf(UUID programmerId) throws DocumentException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);

        document.open();

        // Title
        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Paragraph title = new Paragraph("Reporte de Asesorías", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Get advisories
        List<Advisory> advisories = advisoryRepository.findByProgrammerId(programmerId, null).getContent();

        // Table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 3, 2, 2, 3 });

        // Headers
        addTableHeader(table, "Solicitante");
        addTableHeader(table, "Fecha");
        addTableHeader(table, "Estado");
        addTableHeader(table, "Comentario");

        // Rows
        for (Advisory advisory : advisories) {
            table.addCell(advisory.getExternal().getName());
            table.addCell(advisory.getScheduledAt().format(DATE_FORMATTER));
            table.addCell(advisory.getStatus().name());
            table.addCell(advisory.getRequestComment() != null ? advisory.getRequestComment() : "-");
        }

        document.add(table);
        document.close();

        return baos.toByteArray();
    }

    public byte[] generateAdvisoriesExcel(UUID programmerId) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Asesorías");

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // Headers
            Row headerRow = sheet.createRow(0);
            String[] columns = { "ID", "Solicitante", "Email", "Fecha Programada", "Estado", "Comentario", "Respuesta" };
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data
            List<Advisory> advisories = advisoryRepository.findByProgrammerId(programmerId, null).getContent();
            int rowNum = 1;
            for (Advisory advisory : advisories) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(advisory.getId().toString());
                row.createCell(1).setCellValue(advisory.getExternal().getName());
                row.createCell(2).setCellValue(advisory.getExternal().getEmail());
                row.createCell(3).setCellValue(advisory.getScheduledAt().format(DATE_FORMATTER));
                row.createCell(4).setCellValue(advisory.getStatus().name());
                row.createCell(5).setCellValue(advisory.getRequestComment() != null ? advisory.getRequestComment() : "");
                row.createCell(6).setCellValue(advisory.getResponseMessage() != null ? advisory.getResponseMessage() : "");
            }

            // Auto-size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos.toByteArray();
        }
    }

    // ============ PROJECT REPORTS ============

    public byte[] generateProjectsPdf(UUID programmerId) throws DocumentException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);

        document.open();

        // Title
        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Paragraph title = new Paragraph("Reporte de Proyectos", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Get projects
        List<Project> projects = projectRepository.findByUserIdOrderByCreatedAtDesc(programmerId);

        // Table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 3, 2, 2, 3 });

        // Headers
        addTableHeader(table, "Título");
        addTableHeader(table, "Tipo");
        addTableHeader(table, "Estado");
        addTableHeader(table, "Tecnologías");

        // Rows
        for (Project project : projects) {
            table.addCell(project.getTitle());
            table.addCell(project.getProjectType().name());
            table.addCell(project.getStatus().name());
            table.addCell(project.getTechnologies() != null ? String.join(", ", project.getTechnologies()) : "-");
        }

        document.add(table);
        document.close();

        return baos.toByteArray();
    }

    public byte[] generateProjectsExcel(UUID programmerId) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Proyectos");

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // Headers
            Row headerRow = sheet.createRow(0);
            String[] columns = { "ID", "Título", "Descripción", "Tipo", "Rol", "Tecnologías", "Estado", "URL Repo", "URL Demo" };
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data
            List<Project> projects = projectRepository.findByUserIdOrderByCreatedAtDesc(programmerId);
            int rowNum = 1;
            for (Project project : projects) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(project.getId().toString());
                row.createCell(1).setCellValue(project.getTitle());
                row.createCell(2).setCellValue(project.getDescription() != null ? project.getDescription() : "");
                row.createCell(3).setCellValue(project.getProjectType().name());
                row.createCell(4).setCellValue(project.getRoleInProject() != null ? project.getRoleInProject() : "");
                row.createCell(5).setCellValue(project.getTechnologies() != null ? String.join(", ", project.getTechnologies()) : "");
                row.createCell(6).setCellValue(project.getStatus().name());
                row.createCell(7).setCellValue(project.getRepoUrl() != null ? project.getRepoUrl() : "");
                row.createCell(8).setCellValue(project.getDemoUrl() != null ? project.getDemoUrl() : "");
            }

            // Auto-size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos.toByteArray();
        }
    }

    private void addTableHeader(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, new Font(Font.HELVETICA, 10, Font.BOLD)));
        cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
        cell.setPadding(5);
        table.addCell(cell);
    }
}
