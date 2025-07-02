
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

export const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (elementId: string, fileName: string) => {
    console.log('Starting PDF generation for element:', elementId);
    
    try {
      setIsGenerating(true);
      
      const element = document.getElementById(elementId);
      if (!element) {
        console.error('Element not found:', elementId);
        throw new Error('Elemento não encontrado');
      }

      console.log('Element found, generating canvas...');

      toast({
        title: "Gerando PDF...",
        description: "Por favor, aguarde enquanto preparamos seu currículo.",
      });

      // Aguardar um pouco para garantir que o toast seja exibido
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capturar o elemento como canvas com configurações otimizadas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      console.log('Canvas generated successfully, dimensions:', canvas.width, 'x', canvas.height);

      // Criar PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      console.log('Image data generated, length:', imgData.length);
      
      // Configurações do PDF para A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Dimensões da página A4 em mm
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      console.log('PDF page dimensions:', pageWidth, 'x', pageHeight);
      
      // Calcular proporções mantendo aspecto
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = Math.min(pageWidth / (canvasWidth * 0.264583), pageHeight / (canvasHeight * 0.264583));
      
      const imgWidth = canvasWidth * 0.264583 * ratio;
      const imgHeight = canvasHeight * 0.264583 * ratio;
      
      // Centralizar na página
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      console.log('Adding image to PDF with dimensions:', imgWidth, 'x', imgHeight, 'at position:', x, ',', y);
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      console.log('Attempting to save PDF as:', `${fileName}.pdf`);
      
      // Tentar diferentes métodos de download
      try {
        // Método 1: save() direto
        pdf.save(`${fileName}.pdf`);
        console.log('PDF saved successfully using save() method');
      } catch (saveError) {
        console.log('Direct save failed, trying blob method:', saveError);
        
        // Método 2: blob + download
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('PDF downloaded successfully using blob method');
      }

      toast({
        title: "PDF gerado com sucesso!",
        description: "Seu currículo foi baixado como PDF.",
      });

      console.log('PDF generation completed successfully');

    } catch (error) {
      console.error('Erro detalhado ao gerar PDF:', error);
      
      // Log adicional para debug
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      toast({
        title: "Erro ao gerar PDF",
        description: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Verifique o console para mais detalhes.`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDF,
    isGenerating
  };
};
