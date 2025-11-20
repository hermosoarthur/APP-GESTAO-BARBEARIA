// import { ref, set, get, update, remove, push } from 'firebase/database';
// import { db } from '../../firebase-config';

// export const databaseService = {
//   // CRUD Genérico
//   async create(collection, data) {
//     try {
//       const newRef = push(ref(db, collection));
//       await set(newRef, { ...data, id: newRef.key, createdAt: new Date().toISOString() });
//       return { success: true, id: newRef.key };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   },

//   async read(collection) {
//     try {
//       const snapshot = await get(ref(db, collection));
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const items = Object.keys(data).map(key => ({ ...data[key], id: key }));
//         return { success: true, data: items };
//       }
//       return { success: true, data: [] };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   },

//   async update(collection, id, data) {
//     try {
//       await update(ref(db, `${collection}/${id}`), { ...data, updatedAt: new Date().toISOString() });
//       return { success: true };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   },

//   async delete(collection, id) {
//     try {
//       await remove(ref(db, `${collection}/${id}`));
//       return { success: true };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   },

//   // Métodos específicos
//   async getAgendamentosByDate(date) {
//     const result = await this.read('agendamentos');
//     if (result.success) {
//       const filtered = result.data.filter(ag => ag.data === date);
//       return { success: true, data: filtered };
//     }
//     return result;
//   },

//   async getUserByEmail(email) {
//     const result = await this.read('users');
//     if (result.success) {
//       const user = result.data.find(u => u.email === email);
//       return { success: true, user: user || null };
//     }
//     return result;
//   }
// };

// Versão temporária com dados mock para desenvolvimento
let mockData = {
  users: [
    { id: '1', email: 'admin@barber.com', type: 'admin', createdAt: new Date().toISOString() }
  ],
  agendamentos: [
    { id: '1', cliente: 'João Silva', telefone: '(11) 99999-9999', servico: 'Corte Social', barbeiro: 'Carlos', data: '2024-01-15', hora: '09:00', status: 'agendado' },
    { id: '2', cliente: 'Maria Santos', telefone: '(11) 88888-8888', servico: 'Barba', barbeiro: 'Pedro', data: '2024-01-15', hora: '10:00', status: 'confirmado' },
    { id: '3', cliente: 'José Oliveira', telefone: '(11) 77777-7777', servico: 'Corte + Barba', barbeiro: 'Ana', data: '2024-01-15', hora: '11:00', status: 'concluido' }
  ],
  servicos: [
    { id: '1', nome: 'Corte Social', preco: 35, duracao: 30, descricao: 'Corte tradicional masculino' },
    { id: '2', nome: 'Barba', preco: 25, duracao: 20, descricao: 'Aparar e modelar barba' },
    { id: '3', nome: 'Corte + Barba', preco: 55, duracao: 50, descricao: 'Pacote completo' }
  ],
  funcionarios: [
    { id: '1', nome: 'Carlos Silva', telefone: '(11) 99999-9999', email: 'carlos@barber.com', funcao: 'Barbeiro', status: 'ativo' },
    { id: '2', nome: 'Pedro Santos', telefone: '(11) 88888-8888', email: 'pedro@barber.com', funcao: 'Barbeiro', status: 'ativo' },
    { id: '3', nome: 'Ana Oliveira', telefone: '(11) 77777-7777', email: 'ana@barber.com', funcao: 'Barbeira', status: 'inativo' }
  ],
  vendas: []
};

export const databaseService = {
  async create(collection, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = Date.now().toString();
        const newItem = { ...data, id, createdAt: new Date().toISOString() };
        if (!mockData[collection]) mockData[collection] = [];
        mockData[collection].push(newItem);
        console.log(`[DEV] Criado em ${collection}:`, newItem);
        resolve({ success: true, id });
      }, 500);
    });
  },

  async read(collection) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = mockData[collection] || [];
        console.log(`[DEV] Lendo ${collection}:`, data.length, 'itens');
        resolve({ success: true, data });
      }, 500);
    });
  },

  async update(collection, id, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!mockData[collection]) {
          resolve({ success: false, error: 'Coleção não encontrada' });
          return;
        }
        
        const index = mockData[collection].findIndex(item => item.id === id);
        if (index !== -1) {
          mockData[collection][index] = { 
            ...mockData[collection][index], 
            ...data, 
            updatedAt: new Date().toISOString() 
          };
          console.log(`[DEV] Atualizado em ${collection}:`, mockData[collection][index]);
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Item não encontrado' });
        }
      }, 500);
    });
  },

  async delete(collection, id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!mockData[collection]) {
          resolve({ success: false, error: 'Coleção não encontrada' });
          return;
        }
        
        const initialLength = mockData[collection].length;
        mockData[collection] = mockData[collection].filter(item => item.id !== id);
        const deleted = initialLength > mockData[collection].length;
        
        console.log(`[DEV] Deletado de ${collection}:`, deleted ? 'Sucesso' : 'Item não encontrado');
        resolve({ success: deleted });
      }, 500);
    });
  },

  async getAgendamentosByDate(date) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockData.agendamentos.filter(ag => ag.data === date);
        resolve({ success: true, data: filtered });
      }, 500);
    });
  },

  async getUserByEmail(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockData.users.find(u => u.email === email);
        resolve({ success: true, user: user || null });
      }, 500);
    });
  },

  async getServicosMaisVendidos() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const servicos = [
          { nome: 'Corte Social', quantidade: 15, valor: 525 },
          { nome: 'Barba', quantidade: 8, valor: 200 },
          { nome: 'Corte + Barba', quantidade: 12, valor: 660 }
        ];
        resolve({ success: true, data: servicos });
      }, 500);
    });
  }
};