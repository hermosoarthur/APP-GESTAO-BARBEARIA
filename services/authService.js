// import emailjs from '@emailjs/browser';

// const EMAILJS_CONFIG = {
//   serviceId: 'service_tkkff63',
//   templateId: 'template_nud8bzt', 
//   publicKey: 'egdpw3w8SPP9kEqo1'
// };

// export const authService = {
//   async sendVerificationCode(email) {
//     try {
//       const code = Math.floor(100000 + Math.random() * 900000).toString();
      
//       const templateParams = {
//         to_email: email,
//         verification_code: code,
//         from_name: 'App Barber'
//       };

//       const result = await emailjs.send(
//         EMAILJS_CONFIG.serviceId,
//         EMAILJS_CONFIG.templateId,
//         templateParams,
//         EMAILJS_CONFIG.publicKey
//       );

//       return result.status === 200 
//         ? { success: true, code }
//         : { success: false, error: 'Falha no envio' };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   },

//   validateCode(input, sent) {
//     return input === sent;
//   }
// };

// Versão temporária sem EmailJS - para desenvolvimento
export const authService = {
  async sendVerificationCode(email) {
    try {
      // Simula o envio de email - retorna código fixo para desenvolvimento
      const code = "123456"; // Código fixo para testes
      
      console.log(`[DEV] Código de verificação para ${email}: ${code}`);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, code });
        }, 1000);
      });
    } catch (error) {
      return { success: false, error: 'Falha no serviço de email' };
    }
  },

  validateCode(input, sent) {
    return input === sent;
  }
};