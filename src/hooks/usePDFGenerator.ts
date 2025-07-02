
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

export const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (elementId: string, fileName: string) => {
    try {
      setIsGenerating(true);
      
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Elemento não encontrado');
      }

      toast({
        title: "Gerando PDF...",
        description: "Por favor, aguarde enquanto preparamos seu currículo.",
      });

      // Capturar o elemento como canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Melhor qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Criar PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calcular dimensões para ajustar à página A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.height / canvas.width;
      const pdfAspectRatio = pdfHeight / pdfWidth;

      let imgWidth, imgHeight;
      let xOffset = 0;
      let yOffset = 0;

      if (canvasAspectRatio > pdfAspectRatio) {
        // Canvas é mais alto proporcionalmente
        imgHeight = pdfHeight;
        imgWidth = pdfHeight / canvasAspectRatio;
        xOffset = (pdfWidth - imgWidth) / 2;
      } else {
        // Canvas é mais largo proporcionalmente
        imgWidth = pdfWidth;
        imgHeight = pdfWidth * canvasAspectRatio;
        yOffset = (pdfHeight - imgHeight) / 2;
      }

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
      
      // Baixar o PDF
      pdf.save(`${fileName}.pdf`);

      toast({
        title: "PDF gerado com sucesso!",
        description: "Seu currículo foi baixado como PDF.",
      });

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF. Tente novamente.",
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
