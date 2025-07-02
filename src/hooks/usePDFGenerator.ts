
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
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capturar o elemento como canvas com configurações otimizadas
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      console.log('Canvas generated successfully');

      // Criar PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Configurações do PDF para A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Dimensões da página A4 em mm
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular proporções mantendo aspecto
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = Math.min(pageWidth / (canvasWidth * 0.264583), pageHeight / (canvasHeight * 0.264583));
      
      const imgWidth = canvasWidth * 0.264583 * ratio;
      const imgHeight = canvasHeight * 0.264583 * ratio;
      
      // Centralizar na página
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      console.log('Adding image to PDF...');
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      console.log('Saving PDF...');
      
      // Baixar o PDF
      pdf.save(`${fileName}.pdf`);

      toast({
        title: "PDF gerado com sucesso!",
        description: "Seu currículo foi baixado como PDF.",
      });

      console.log('PDF generation completed successfully');

    } catch (error) {
      console.error('Erro detalhado ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF. Verifique o console para mais detalhes.",
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
