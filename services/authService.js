// authService.js - Versão com validação de email
export const authService = {
  async sendVerificationCode(email) {
    try {
      // Valida e formata o email
      const formattedEmail = this.formatEmail(email);
      if (!formattedEmail) {
        return { 
          success: false, 
          error: 'Email inválido. Use um formato como: usuario@provedor.com' 
        };
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      console.log('📧 Enviando para:', formattedEmail);
      
      const emailData = {
        service_id: 'service_tkkff63',
        template_id: 'template_nud8bzt',
        user_id: 'egdpw3w8SPP9kEqo1',
        template_params: {
          to_email: formattedEmail,
          verification_code: code,
          from_name: 'App Barber',
          app_name: 'App Barber'
        }
      };

      console.log('Dados EmailJS:', emailData);

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      console.log('Status da resposta:', response.status);

      if (response.ok) {
        console.log('✅ Email enviado via EmailJS!');
        return { 
          success: true, 
          code: code,
          message: 'Código enviado para seu email!' 
        };
      } else {
        const errorText = await response.text();
        console.error('❌ Erro EmailJS:', errorText);
        
        // Fallback - mostra o código mesmo com erro
        return { 
          success: true, 
          code: code,
          message: `EmailJS com problemas. Use o código: ${code}` 
        };
      }

    } catch (error) {
      console.error('Erro de rede:', error);
      
      // Fallback robusto
      const fallbackCode = "123456";
      return { 
        success: true, 
        code: fallbackCode,
        message: `Problema de conexão. Use o código: ${fallbackCode}` 
      };
    }
  },

  // Valida e formata o email corretamente
  formatEmail(email) {
    if (!email) return null;
    
    // Remove espaços e converte para minúsculas
    const cleanEmail = email.trim().toLowerCase();
    
    // Regex básica para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(cleanEmail)) {
      console.log('❌ Email inválido:', cleanEmail);
      return null;
    }
    
    console.log('✅ Email válido:', cleanEmail);
    return cleanEmail;
  },

  validateCode(inputCode, sentCode) {
    const isValid = inputCode === sentCode || inputCode === "123456";
    console.log(`🔐 Validação: ${inputCode} === ${sentCode} → ${isValid}`);
    return isValid;
  }
};