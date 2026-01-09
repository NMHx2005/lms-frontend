/**
 * Service để tạo và download Quiz Template Excel
 * Format: Question | Type | Answers | Correct Answer | Explanation | Points | Difficulty
 */

/**
 * Tạo CSV content cho Quiz Template
 */
export const generateQuizTemplateCSV = (): string => {
  const headers = [
    'Question',
    'Type',
    'Answers',
    'Correct Answer',
    'Explanation',
    'Points',
    'Difficulty'
  ];

  // Sample questions - chỉ giữ 3 ví dụ đơn giản
  const sampleQuestions = [
    // Multiple Choice - Ví dụ 1
    {
      question: 'Java là ngôn ngữ lập trình gì?',
      type: 'multiple-choice',
      answers: 'Lập trình hướng đối tượng|Lập trình hàm|Lập trình logic|Lập trình thủ tục',
      correctAnswer: '0',
      explanation: 'Java là ngôn ngữ lập trình hướng đối tượng (OOP)',
      points: '10',
      difficulty: 'easy'
    },
    // Multiple Choice - Ví dụ 2
    {
      question: 'Từ khóa nào dùng để khai báo class trong Java?',
      type: 'multiple-choice',
      answers: 'class|Class|CLASS|def',
      correctAnswer: '0',
      explanation: 'Từ khóa "class" (chữ thường) dùng để khai báo class trong Java',
      points: '10',
      difficulty: 'easy'
    },
    // Multiple Choice - Ví dụ 3
    {
      question: 'JVM là viết tắt của gì?',
      type: 'multiple-choice',
      answers: 'Java Virtual Machine|Java Variable Manager|Java Version Manager|Java Visual Machine',
      correctAnswer: '0',
      explanation: 'JVM (Java Virtual Machine) là máy ảo chạy bytecode Java',
      points: '10',
      difficulty: 'easy'
    },
  ];

  // Tạo CSV content đơn giản - chỉ có header và ví dụ

  // Tạo rows với format CSV đơn giản - tất cả field đều wrap trong quotes để Excel parse đúng
  const rows = [
    headers.join(','),
    // Thêm các câu hỏi mẫu
    ...sampleQuestions.map(q => {
      // Tất cả field đều wrap trong quotes để đảm bảo Excel tách cột đúng
      const wrap = (text: string) => `"${String(text).replace(/"/g, '""')}"`;

      return [
        wrap(q.question),
        wrap(q.type),
        wrap(q.answers),
        wrap(q.correctAnswer),
        wrap(q.explanation || ''),
        wrap(q.points || '10'),
        wrap(q.difficulty || 'easy')
      ].join(',');
    })
  ];

  return rows.join('\r\n'); // Dùng \r\n cho Windows Excel
};

/**
 * Download Quiz Template Excel
 * Generate CSV file với format chuẩn để Excel tự động parse thành table
 */
export const downloadQuizTemplate = () => {
  try {
    // Generate CSV content - đã đúng format với comma separator
    const csvContent = generateQuizTemplateCSV();

    // Thêm BOM (Byte Order Mark) UTF-8 để Excel nhận diện đúng encoding
    const BOM = '\uFEFF';
    const contentWithBOM = BOM + csvContent;

    // Tạo blob với encoding UTF-8 và MIME type đúng
    const blob = new Blob([contentWithBOM], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quiz-template-mau-cau-hoi.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading template:', error);
    throw error;
  }
};
