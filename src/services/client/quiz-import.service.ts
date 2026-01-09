/**
 * Service để parse và import quiz questions từ CSV/Excel file
 */

export interface ParsedQuizQuestion {
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
  points?: number;
  difficulty?: string;
}

/**
 * Parse CSV content thành quiz questions
 */
export const parseQuizCSV = (csvContent: string): ParsedQuizQuestion[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const questions: ParsedQuizQuestion[] = [];
  
  // Tìm dòng header
  let headerIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Question') && lines[i].includes('Type')) {
      headerIndex = i;
      break;
    }
  }
  
  if (headerIndex === -1) {
    throw new Error('Không tìm thấy header trong file CSV');
  }
  
  // Parse từ dòng sau header, bỏ qua các dòng hướng dẫn
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Bỏ qua dòng trống hoặc dòng hướng dẫn
    if (!line || 
        line.startsWith('HƯỚNG DẪN') || 
        line.startsWith('=====') || 
        line.startsWith('CỘT') || 
        line.startsWith('CÁC LOẠI') ||
        line.startsWith('VÍ DỤ') ||
        line.startsWith('1.') ||
        line.startsWith('2.') ||
        line.startsWith('3.') ||
        line.startsWith('4.') ||
        line.startsWith('5.') ||
        line.startsWith('6.') ||
        line.startsWith('7.') ||
        line.startsWith('8.') ||
        line.includes('   -')) {
      continue;
    }
    
    try {
      const parsed = parseCSVLine(line);
      if (parsed && parsed.question && parsed.type) {
        // Chỉ hỗ trợ multiple-choice cho bây giờ (theo format hiện tại của hệ thống)
        if (parsed.type === 'multiple-choice' && parsed.answers.length >= 2) {
          questions.push({
            question: parsed.question,
            answers: parsed.answers,
            correctAnswer: parsed.correctAnswer,
            explanation: parsed.explanation || '',
            points: parsed.points,
            difficulty: parsed.difficulty
          });
        }
      }
    } catch (error) {
      console.warn(`Lỗi parse dòng ${i + 1}:`, error);
      // Bỏ qua dòng lỗi, tiếp tục
    }
  }
  
  return questions;
};

/**
 * Parse một dòng CSV
 */
const parseCSVLine = (line: string): {
  question: string;
  type: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
  points?: number;
  difficulty?: string;
} | null => {
  // Parse CSV với xử lý quotes
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      fields.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  // Add last field
  if (currentField || inQuotes) {
    fields.push(currentField.trim());
  }
  
  if (fields.length < 4) {
    return null;
  }
  
  const question = fields[0] || '';
  const type = fields[1] || '';
  const answersStr = fields[2] || '';
  const correctAnswerStr = fields[3] || '';
  const explanation = fields[4] || '';
  const points = fields[5] ? parseInt(fields[5], 10) : undefined;
  const difficulty = fields[6] || '';
  
  // Parse answers (phân cách bằng |)
  const answers = answersStr.split('|').map(a => a.trim()).filter(a => a);
  
  // Parse correct answer (index)
  let correctAnswer = 0;
  if (correctAnswerStr) {
    const parsed = parseInt(correctAnswerStr.replace(/"/g, ''), 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed < answers.length) {
      correctAnswer = parsed;
    }
  }
  
  // Chỉ hỗ trợ multiple-choice với 4 đáp án
  if (type === 'multiple-choice' && answers.length >= 2) {
    // Đảm bảo có đủ 4 đáp án
    while (answers.length < 4) {
      answers.push('');
    }
    // Chỉ lấy 4 đáp án đầu
    const finalAnswers = answers.slice(0, 4);
    
    return {
      question,
      type,
      answers: finalAnswers,
      correctAnswer,
      explanation,
      points,
      difficulty
    };
  }
  
  return null;
};

/**
 * Đọc file CSV từ File object
 */
export const readCSVFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => {
      reject(new Error('Lỗi khi đọc file'));
    };
    
    // Đọc với UTF-8 encoding
    reader.readAsText(file, 'UTF-8');
  });
};
