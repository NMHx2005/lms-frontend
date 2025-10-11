import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

interface PDFReportData {
    totalEarnings: number;
    monthlyEarnings: number;
    totalStudents: number;
    totalCourses: number;
    monthlyBreakdown: Array<{
        month: string;
        earnings: number;
        students: number;
        courses: number;
    }>;
    teacherName?: string;
    reportDate: Date;
}

export const generateEarningsPDF = async (data: PDFReportData) => {
    try {
        // Create PDF document
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        let yPosition = 20;

        // Colors
        const primaryColor = [91, 141, 239]; // #5b8def
        const secondaryColor = [139, 92, 246]; // #8b5cf6
        const successColor = [34, 197, 94]; // #22c55e
        const textColor = [55, 65, 81]; // #374151

        // Helper function to format currency
        const formatCurrency = (amount: number) => {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount);
        };

        // Header
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(0, 0, pageWidth, 35, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EARNINGS REPORT', pageWidth / 2, 15, { align: 'center' });

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${data.teacherName || 'Instructor'} • ${data.reportDate.toLocaleDateString('en-US')}`, pageWidth / 2, 25, { align: 'center' });

        yPosition = 50;

    // Summary Cards
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EARNINGS OVERVIEW', 20, yPosition);
    yPosition += 15;

        // Card 1 - Total Earnings
        pdf.setFillColor(248, 250, 252); // Light gray background
        pdf.rect(20, yPosition, 80, 25, 'F');
        pdf.setDrawColor(229, 231, 235);
        pdf.rect(20, yPosition, 80, 25);

        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Total Revenue', 25, yPosition + 8);

        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(formatCurrency(data.totalEarnings), 25, yPosition + 18);

        // Card 2 - Monthly Earnings
        pdf.setFillColor(248, 250, 252);
        pdf.rect(110, yPosition, 80, 25, 'F');
        pdf.setDrawColor(229, 231, 235);
        pdf.rect(110, yPosition, 80, 25);

        pdf.setTextColor(successColor[0], successColor[1], successColor[2]);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('This Month Revenue', 115, yPosition + 8);

        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(formatCurrency(data.monthlyEarnings), 115, yPosition + 18);

        yPosition += 40;

        // Card 3 - Total Students
        pdf.setFillColor(248, 250, 252);
        pdf.rect(20, yPosition, 80, 25, 'F');
        pdf.setDrawColor(229, 231, 235);
        pdf.rect(20, yPosition, 80, 25);

        pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Total Students', 25, yPosition + 8);

        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(data.totalStudents.toString(), 25, yPosition + 18);

        // Card 4 - Total Courses
        pdf.setFillColor(248, 250, 252);
        pdf.rect(110, yPosition, 80, 25, 'F');
        pdf.setDrawColor(229, 231, 235);
        pdf.rect(110, yPosition, 80, 25);

        pdf.setTextColor(245, 158, 11); // Orange
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Active Courses', 115, yPosition + 8);

        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(data.totalCourses.toString(), 115, yPosition + 18);

        yPosition += 50;

    // Monthly Breakdown Chart
    if (data.monthlyBreakdown && data.monthlyBreakdown.length > 0) {
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MONTHLY REVENUE BREAKDOWN', 20, yPosition);
      yPosition += 15;

            // Table headers
            pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            pdf.rect(20, yPosition, pageWidth - 40, 10, 'F');

            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Month', 25, yPosition + 7);
            pdf.text('Revenue', 60, yPosition + 7);
            pdf.text('Students', 100, yPosition + 7);
            pdf.text('Courses', 130, yPosition + 7);
            pdf.text('Avg/Course', 160, yPosition + 7);

            yPosition += 10;

            // Table data
            data.monthlyBreakdown.forEach((month, index) => {
                const bgColor = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
                pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
                pdf.rect(20, yPosition, pageWidth - 40, 8, 'F');

                pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'normal');
                pdf.text(month.month, 25, yPosition + 6);
                pdf.text(formatCurrency(month.earnings), 60, yPosition + 6);
                pdf.text(month.students.toString(), 100, yPosition + 6);
                pdf.text(month.courses.toString(), 130, yPosition + 6);

                const avgPerCourse = month.courses > 0 ? month.earnings / month.courses : 0;
                pdf.text(formatCurrency(avgPerCourse), 160, yPosition + 6);

                yPosition += 8;
            });
        }

        yPosition += 20;

        // Footer
        pdf.setDrawColor(229, 231, 235);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;

        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Report generated automatically by LMS System', pageWidth / 2, yPosition, { align: 'center' });
        pdf.text(`Generated: ${data.reportDate.toLocaleString('en-US')}`, pageWidth / 2, yPosition + 5, { align: 'center' });

        // Save PDF
        const fileName = `EarningsReport_${data.teacherName?.replace(/\s+/g, '_') || 'Instructor'}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);

        toast.success('PDF report generated successfully!');

    } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error('Error generating PDF report');
    }
};

export default generateEarningsPDF;
