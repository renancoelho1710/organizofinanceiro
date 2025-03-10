import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from './formatCurrency';
import { formatDate } from './dateHelpers';
import { Transaction, Category } from '@shared/schema';
import * as xmljs from 'xml-js';

// Estendendo o tipo jsPDF para incluir o método autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ExportOptions {
  title: string;
  fileName: string;
  period?: string;
}

/**
 * Export transactions to PDF
 * 
 * @param transactions - Transactions to export
 * @param categories - Categories to include category names
 * @param options - Export options
 */
export function exportTransactionsToPDF(
  transactions: Transaction[],
  categories: Category[],
  options: ExportOptions
): void {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(89, 44, 130); // Purple color
  doc.text(options.title, 105, 15, { align: 'center' });

  // Add subtitle with period if provided
  if (options.period) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(89, 44, 130);
    doc.text(options.period, 105, 22, { align: 'center' });
  }

  // Add logo or decoration
  doc.setDrawColor(89, 44, 130);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);
  
  // Add current date
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.text(`Gerado em: ${formatDate(new Date())}`, 190, 32, { align: 'right' });

  // Prepare data for table
  const tableHeaders = [
    { header: 'Data', dataKey: 'date' },
    { header: 'Descrição', dataKey: 'description' },
    { header: 'Categoria', dataKey: 'category' },
    { header: 'Tipo', dataKey: 'type' },
    { header: 'Valor', dataKey: 'amount' }
  ];

  const tableData = transactions.map(transaction => {
    return {
      date: formatDate(transaction.date),
      description: transaction.description,
      category: transaction.category,
      type: transaction.type === 'income' ? 'Receita' : 'Despesa',
      amount: formatCurrency(Number(transaction.amount))
    };
  });

  // Add table
  doc.autoTable({
    head: [tableHeaders.map(h => h.header)],
    body: tableData.map(row => [
      row.date,
      row.description,
      row.category,
      row.type,
      row.amount
    ]),
    startY: 40,
    styles: {
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [89, 44, 130],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 249]
    },
    columnStyles: {
      4: { halign: 'right' }
    }
  });

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;
  
  // Add totals section
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  doc.text('Resumo', 20, finalY);
  doc.line(20, finalY + 2, 50, finalY + 2);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  // Total Income
  doc.text('Total de Receitas:', 20, finalY + 10);
  doc.setTextColor(22, 163, 74); // Green color
  doc.text(formatCurrency(totalIncome), 190, finalY + 10, { align: 'right' });
  
  // Total Expense
  doc.setTextColor(0, 0, 0);
  doc.text('Total de Despesas:', 20, finalY + 18);
  doc.setTextColor(220, 38, 38); // Red color
  doc.text(formatCurrency(totalExpense), 190, finalY + 18, { align: 'right' });
  
  // Balance
  doc.setTextColor(0, 0, 0);
  doc.text('Saldo:', 20, finalY + 26);
  
  if (balance >= 0) {
    doc.setTextColor(22, 163, 74); // Green color
  } else {
    doc.setTextColor(220, 38, 38); // Red color
  }
  
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(balance), 190, finalY + 26, { align: 'right' });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Página ${i} de ${pageCount} - Organizo Financeiro`,
      105,
      285,
      { align: 'center' }
    );
  }
  
  // Save PDF
  doc.save(`${options.fileName}.pdf`);
}

/**
 * Export transactions to XML
 * 
 * @param transactions - Transactions to export
 * @param options - Export options
 */
export function exportTransactionsToXML(
  transactions: Transaction[],
  options: ExportOptions
): void {
  // Prepare data for XML
  const xmlData = {
    _declaration: {
      _attributes: {
        version: '1.0',
        encoding: 'utf-8'
      }
    },
    report: {
      _attributes: {
        title: options.title,
        generatedAt: new Date().toISOString(),
        period: options.period || ''
      },
      transactions: {
        transaction: transactions.map(transaction => ({
          date: { _text: transaction.date },
          description: { _text: transaction.description },
          amount: { _text: transaction.amount.toString() },
          type: { _text: transaction.type },
          category: { _text: transaction.category },
          paymentMethod: { _text: transaction.paymentMethod || '' },
          notes: { _text: transaction.notes || '' }
        }))
      },
      summary: {
        totalIncome: { 
          _text: transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0)
            .toString()
        },
        totalExpense: {
          _text: transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0)
            .toString()
        }
      }
    }
  };

  // Convert to XML
  const xml = xmljs.js2xml(xmlData, {
    compact: true,
    spaces: 2
  });

  // Create download link
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `${options.fileName}.xml`;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}