/**
 * Parse CSV content to an array of objects
 * 
 * @param content - CSV content as string
 * @param options - Parsing options
 * @returns Array of parsed objects
 */
export function parseCSV<T>(
  content: string, 
  options: {
    delimiter?: string;
    hasHeader?: boolean;
    mapHeaders?: Record<string, string>;
  } = {}
): T[] {
  const { 
    delimiter = ',', 
    hasHeader = true,
    mapHeaders = {} 
  } = options;
  
  // Split content into rows
  const rows = content.split(/\r?\n/).filter(row => row.trim().length > 0);
  
  if (rows.length === 0) {
    return [];
  }
  
  let headers: string[] = [];
  let startIndex = 0;
  
  // Parse header row if needed
  if (hasHeader) {
    headers = rows[0].split(delimiter).map(header => 
      mapHeaders[header.trim()] || header.trim()
    );
    startIndex = 1;
  } else {
    // Generate numeric headers if no header row
    const columnCount = rows[0].split(delimiter).length;
    headers = Array.from({ length: columnCount }, (_, i) => `column${i}`);
  }
  
  // Parse data rows
  const data: T[] = [];
  
  for (let i = startIndex; i < rows.length; i++) {
    const values = rows[i].split(delimiter);
    const row: Record<string, any> = {};
    
    // Skip rows with different column counts
    if (values.length !== headers.length) {
      continue;
    }
    
    // Map values to headers
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j].trim();
    }
    
    data.push(row as T);
  }
  
  return data;
}

/**
 * Parse CSV file to an array of objects
 * 
 * @param file - CSV file
 * @param options - Parsing options
 * @returns Promise resolving to array of parsed objects
 */
export function parseCSVFile<T>(
  file: File,
  options: {
    delimiter?: string;
    hasHeader?: boolean;
    mapHeaders?: Record<string, string>;
    encoding?: string;
  } = {}
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = parseCSV<T>(content, options);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file, options.encoding || 'UTF-8');
  });
}

/**
 * Map common Portuguese financial columns to standardized names
 */
export const financialColumnMapping = {
  // Date columns
  'data': 'date',
  'dt': 'date',
  'data da transação': 'date',
  'data transação': 'date',
  'data do lançamento': 'date',
  
  // Description columns
  'descrição': 'description',
  'descricao': 'description',
  'histórico': 'description',
  'historico': 'description',
  'lançamento': 'description',
  'lancamento': 'description',
  
  // Amount columns
  'valor': 'amount',
  'quantia': 'amount',
  'montante': 'amount',
  
  // Category columns
  'categoria': 'category',
  'tipo': 'type',
  
  // Type columns (income/expense)
  'receita/despesa': 'type',
  'entrada/saída': 'type',
  'entrada/saida': 'type',
  
  // Payment method columns
  'método de pagamento': 'paymentMethod',
  'metodo de pagamento': 'paymentMethod',
  'forma de pagamento': 'paymentMethod',
  'pagamento': 'paymentMethod',
  
  // Notes columns
  'observações': 'notes',
  'observacoes': 'notes',
  'notas': 'notes',
  'comentários': 'notes',
  'comentarios': 'notes',
};

/**
 * Normalize transaction data imported from CSV
 * 
 * @param transactions - Raw parsed transactions
 * @returns Normalized transactions
 */
export function normalizeTransactions(transactions: Record<string, any>[]) {
  return transactions.map(transaction => {
    // Handle amount
    let amount = transaction.amount;
    if (typeof amount === 'string') {
      // Remove currency symbols and convert commas to dots
      amount = amount
        .replace(/[^\d,-]/g, '')  // Remove anything that's not a digit, comma or dash
        .replace(',', '.');       // Convert comma to dot for JS number parsing
      
      amount = parseFloat(amount);
    }
    
    // Determine transaction type (income/expense)
    let type = transaction.type || 'expense';
    
    // If amount is negative, it's an expense
    if (amount < 0) {
      type = 'expense';
      amount = Math.abs(amount);
    } else if (transaction.type === 'receita' || 
               transaction.type === 'entrada' ||
               transaction.type === 'income' ||
               transaction.type === 'revenue') {
      type = 'income';
    } else if (transaction.type === 'despesa' || 
              transaction.type === 'saída' || 
              transaction.type === 'saida' ||
              transaction.type === 'expense') {
      type = 'expense';
    }
    
    // Parse date
    let date = transaction.date;
    if (typeof date === 'string') {
      const parts = date.split(/[\/.-]/);
      
      // Try to determine format (DD/MM/YYYY or MM/DD/YYYY or YYYY-MM-DD)
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // YYYY-MM-DD format
          date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } else if (parseInt(parts[0]) > 12) {
          // DD/MM/YYYY format (day > 12 must be day)
          date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        } else {
          // Assume MM/DD/YYYY format as fallback
          date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
        }
      } else {
        // If can't parse, use current date
        date = new Date();
      }
    } else if (!(date instanceof Date)) {
      date = new Date();
    }
    
    // Ensure category exists
    const category = transaction.category || 'Outros';
    
    return {
      description: transaction.description || '',
      amount,
      date,
      type,
      category,
      paymentMethod: transaction.paymentMethod || 'Outros',
      notes: transaction.notes || '',
    };
  });
}
