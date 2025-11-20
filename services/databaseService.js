// import { ref, set, get, update, remove, push, query, orderByChild, equalTo } from 'firebase/database';
// import { db } from '../firebase-config';

// export const databaseService = {
//   // CRUD Genérico
//   async create(collection, data) {
//     try {
//       const newRef = push(ref(db, collection));
//       const newData = {
//         ...data,
//         id: newRef.key,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };
//       await set(newRef, newData);
//       console.log(`[FIREBASE] Criado em ${collection}:`, newData);
//       return { success: true, id: newRef.key, data: newData };
//     } catch (error) {
//       console.error(`[FIREBASE] Erro ao criar em ${collection}:`, error);
//       return { success: false, error: error.message };
//     }
//   },

//   async read(collection, filters = {}) {
//     try {
//       let dbRef = ref(db, collection);
      
//       const snapshot = await get(dbRef);
      
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const items = Object.keys(data).map(key => ({ 
//           ...data[key], 
//           id: key 
//         }));
        
//         // Aplicar filtros manualmente se fornecidos
//         let filteredItems = items;
//         if (filters.field && filters.value) {
//           filteredItems = items.filter(item => item[filters.field] === filters.value);
//         }
        
//         console.log(`[FIREBASE] Lendo ${collection}:`, filteredItems.length, 'itens');
//         return { success: true, data: filteredItems };
//       }
      
//       console.log(`[FIREBASE] ${collection} vazia`);
//       return { success: true, data: [] };
//     } catch (error) {
//       console.error(`[FIREBASE] Erro ao ler ${collection}:`, error);
//       return { success: false, error: error.message };
//     }
//   },

//   async update(collection, id, data) {
//     try {
//       const updateData = {
//         ...data,
//         updatedAt: new Date().toISOString()
//       };
      
//       await update(ref(db, `${collection}/${id}`), updateData);
//       console.log(`[FIREBASE] Atualizado em ${collection}/${id}:`, updateData);
//       return { success: true, data: updateData };
//     } catch (error) {
//       console.error(`[FIREBASE] Erro ao atualizar ${collection}/${id}:`, error);
//       return { success: false, error: error.message };
//     }
//   },

//   async delete(collection, id) {
//     try {
//       await remove(ref(db, `${collection}/${id}`));
//       console.log(`[FIREBASE] Deletado de ${collection}/${id}`);
//       return { success: true };
//     } catch (error) {
//       console.error(`[FIREBASE] Erro ao deletar ${collection}/${id}:`, error);
//       return { success: false, error: error.message };
//     }
//   },

//   // Métodos específicos - VERSÃO CORRIGIDA
//   async getAgendamentosByDate(date) {
//     try {
//       const result = await this.read('agendamentos', { field: 'data', value: date });
//       return result;
//     } catch (error) {
//       console.error('[FIREBASE] Erro ao buscar agendamentos por data:', error);
//       return { success: false, error: error.message };
//     }
//   },

//   async getUserByEmail(email) {
//     try {
//       // Método alternativo - busca todos e filtra manualmente
//       const result = await this.read('users');
      
//       if (result.success) {
//         const user = result.data.find(u => u.email === email);
//         console.log(`[FIREBASE] Usuário encontrado por email "${email}":`, user ? 'SIM' : 'NÃO');
//         return { success: true, user: user || null };
//       }
      
//       return result;
//     } catch (error) {
//       console.error('[FIREBASE] Erro ao buscar usuário por email:', error);
//       return { success: false, error: error.message };
//     }
//   },

//   async getServicosMaisVendidos(periodo = 'semana') {
//     try {
//       // Buscar todos os agendamentos concluídos
//       const agendamentosResult = await this.read('agendamentos', { field: 'status', value: 'concluido' });
//       const servicosResult = await this.read('servicos');

//       if (agendamentosResult.success && servicosResult.success) {
//         const agendamentos = agendamentosResult.data;
//         const servicos = servicosResult.data;
        
//         const servicosCount = {};
        
//         // Contar serviços realizados
//         agendamentos.forEach(agendamento => {
//           const servicoNome = agendamento.servico;
//           const servico = servicos.find(s => s.nome === servicoNome);
          
//           if (servico) {
//             if (!servicosCount[servicoNome]) {
//               servicosCount[servicoNome] = {
//                 nome: servicoNome,
//                 quantidade: 0,
//                 valor: 0
//               };
//             }
            
//             servicosCount[servicoNome].quantidade += 1;
//             servicosCount[servicoNome].valor += servico.preco;
//           }
//         });
        
//         const servicosArray = Object.values(servicosCount)
//           .sort((a, b) => b.quantidade - a.quantidade)
//           .slice(0, 5);
        
//         return { success: true, data: servicosArray };
//       }
      
//       return { success: true, data: [] };
//     } catch (error) {
//       console.error('[FIREBASE] Erro ao buscar serviços mais vendidos:', error);
//       return { success: false, error: error.message };
//     }
//   },

//   // Método para buscar funcionários ativos
//   async getFuncionariosAtivos() {
//     try {
//       const result = await this.read('funcionarios', { field: 'status', value: 'ativo' });
//       return result;
//     } catch (error) {
//       console.error('[FIREBASE] Erro ao buscar funcionários ativos:', error);
//       return { success: false, error: error.message };
//     }
//   },

//   // Método para criar venda quando agendamento é concluído
//   async createVendaFromAgendamento(agendamento, servico) {
//     try {
//       const vendaData = {
//         agendamentoId: agendamento.id,
//         cliente: agendamento.cliente,
//         servico: agendamento.servico,
//         barbeiro: agendamento.barbeiro,
//         valor: servico.preco,
//         data: agendamento.data,
//         hora: agendamento.hora,
//         tipo: 'servico',
//         createdAt: new Date().toISOString()
//       };
      
//       return await this.create('vendas', vendaData);
//     } catch (error) {
//       console.error('[FIREBASE] Erro ao criar venda:', error);
//       return { success: false, error: error.message };
//     }
//   }
// };

import { ref, set, get, update, remove, push } from 'firebase/database';
import { db } from '../firebase-config';

export const databaseService = {
  // CRUD Genérico - CORRIGIDO para EmailJS
  async create(collection, data, userId) {
    try {
      console.log(`[FIREBASE] Criando em ${collection} para usuário:`, userId);
      
      // VALIDAÇÃO CRÍTICA: Garantir que userId não seja undefined
      if (!userId) {
        throw new Error('User ID é obrigatório para criação');
      }

      const path = `users/${userId}/${collection}`;
      const newRef = push(ref(db, path));
      
      // LIMPAR DADOS: Remover campos undefined/null
      const cleanData = {};
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          cleanData[key] = data[key];
        }
      });

      const newData = {
        ...cleanData,
        id: newRef.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await set(newRef, newData);
      console.log(`[FIREBASE] ✅ Criado em ${path} com ID: ${newRef.key}`);
      return { success: true, id: newRef.key, data: newData };
    } catch (error) {
      console.error(`[FIREBASE] ❌ Erro ao criar em ${collection}:`, error);
      return { success: false, error: error.message };
    }
  },

  async read(collection, userId, filters = {}) {
    try {
      if (!userId) {
        throw new Error('User ID é obrigatório para leitura');
      }

      const path = `users/${userId}/${collection}`;
      const dbRef = ref(db, path);
      
      console.log(`[FIREBASE] Lendo de: ${path}`);
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items = Object.keys(data).map(key => ({ 
          ...data[key], 
          id: key 
        }));
        
        // Aplicar filtros manualmente se fornecidos
        let filteredItems = items;
        if (filters.field && filters.value) {
          filteredItems = items.filter(item => item[filters.field] === filters.value);
        }
        
        console.log(`[FIREBASE] ✅ ${filteredItems.length} itens lidos de ${path}`);
        return { success: true, data: filteredItems };
      }
      
      console.log(`[FIREBASE] 📭 ${path} está vazia`);
      return { success: true, data: [] };
    } catch (error) {
      console.error(`[FIREBASE] ❌ Erro ao ler ${collection}:`, error);
      return { success: false, error: error.message };
    }
  },

  async update(collection, id, data, userId) {
    try {
      if (!userId || !id) {
        throw new Error('User ID e Record ID são obrigatórios para atualização');
      }

      const path = `users/${userId}/${collection}/${id}`;
      
      // LIMPAR DADOS: Remover campos undefined/null
      const cleanData = {};
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          cleanData[key] = data[key];
        }
      });

      const updateData = {
        ...cleanData,
        updatedAt: new Date().toISOString()
      };
      
      await update(ref(db, path), updateData);
      console.log(`[FIREBASE] ✅ Atualizado em ${path}`);
      return { success: true, data: updateData };
    } catch (error) {
      console.error(`[FIREBASE] ❌ Erro ao atualizar ${path}:`, error);
      return { success: false, error: error.message };
    }
  },

  async delete(collection, id, userId) {
    try {
      if (!userId || !id) {
        throw new Error('User ID e Record ID são obrigatórios para exclusão');
      }

      const path = `users/${userId}/${collection}/${id}`;
      await remove(ref(db, path));
      console.log(`[FIREBASE] ✅ Deletado de ${path}`);
      return { success: true };
    } catch (error) {
      console.error(`[FIREBASE] ❌ Erro ao deletar ${path}:`, error);
      return { success: false, error: error.message };
    }
  },

  // MÉTODOS ESPECÍFICOS PARA EMAILJS
  async getUserByEmail(email) {
    try {
      console.log(`[FIREBASE] 🔍 Buscando usuário por email: "${email}"`);
      
      // Busca em todos os usuários
      const snapshot = await get(ref(db, 'users'));
      
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const users = Object.keys(usersData).map(key => ({
          id: key,
          ...usersData[key]
        }));
        
        const user = users.find(u => u.email === email);
        console.log(`[FIREBASE] ${user ? '✅' : '❌'} Usuário "${email}": ${user ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
        return { success: true, user: user || null };
      }
      
      console.log(`[FIREBASE] 📭 Nenhum usuário cadastrado no sistema`);
      return { success: true, user: null };
    } catch (error) {
      console.error('[FIREBASE] ❌ Erro ao buscar usuário por email:', error);
      return { success: false, error: error.message };
    }
  },

  // Criar usuário (para cadastro com EmailJS)
  async createUser(userData) {
    try {
      console.log('[FIREBASE] 👤 Tentando criar usuário:', userData.email);

      // VALIDAÇÃO: Garantir dados obrigatórios
      if (!userData.email) {
        throw new Error('Email é obrigatório');
      }

      // Verificar se usuário já existe
      const existingUser = await this.getUserByEmail(userData.email);
      
      if (existingUser.success && existingUser.user) {
        console.log('[FIREBASE] ⚠️ Usuário já existe:', existingUser.user.email);
        return { 
          success: false, 
          error: 'Usuário já cadastrado com este email' 
        };
      }

      // LIMPAR DADOS do usuário
      const cleanUserData = {};
      Object.keys(userData).forEach(key => {
        if (userData[key] !== undefined && userData[key] !== null) {
          cleanUserData[key] = userData[key];
        }
      });

      // Gerar ID único para o usuário (baseado no email ou timestamp)
      const userId = this.generateUserId(userData.email);
      
      // Criar estrutura completa do usuário
      const userStructure = {
        ...cleanUserData,
        id: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Salvar usuário na coleção global
      await set(ref(db, `users/${userId}`), userStructure);
      
      // Criar estrutura de dados vazia para o usuário
      const userDataStructure = {
        agendamentos: {},
        servicos: {},
        funcionarios: {},
        vendas: {},
        config: {}
      };
      
      await set(ref(db, `users/${userId}/data`), userDataStructure);
      
      console.log(`[FIREBASE] ✅ Usuário criado com ID: ${userId}`);
      return { 
        success: true, 
        id: userId, 
        data: userStructure 
      };
    } catch (error) {
      console.error('[FIREBASE] ❌ Erro ao criar usuário:', error);
      return { success: false, error: error.message };
    }
  },

  // Gerar ID único baseado no email
  generateUserId(email) {
    // Usa o timestamp + hash simples do email
    const timestamp = Date.now().toString(36);
    const emailHash = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
    return `user_${timestamp}_${emailHash}`;
  },

  // Buscar usuário por ID
  async getUserById(userId) {
    try {
      if (!userId) {
        throw new Error('User ID é obrigatório');
      }

      console.log(`[FIREBASE] 🔍 Buscando usuário por ID: "${userId}"`);
      const snapshot = await get(ref(db, `users/${userId}`));
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log(`[FIREBASE] ✅ Usuário encontrado por ID "${userId}"`);
        return { 
          success: true, 
          user: { id: userId, ...userData } 
        };
      }
      
      console.log(`[FIREBASE] ❌ Usuário não encontrado por ID "${userId}"`);
      return { success: true, user: null };
    } catch (error) {
      console.error('[FIREBASE] ❌ Erro ao buscar usuário por ID:', error);
      return { success: false, error: error.message };
    }
  },

  // Métodos específicos para agendamentos
  async getAgendamentosByDate(date, userId) {
    try {
      if (!userId) {
        throw new Error('User ID é obrigatório');
      }
      
      console.log(`[FIREBASE] 📅 Buscando agendamentos para ${date}`);
      const result = await this.read('agendamentos', userId, { field: 'data', value: date });
      return result;
    } catch (error) {
      console.error('[FIREBASE] ❌ Erro ao buscar agendamentos por data:', error);
      return { success: false, error: error.message };
    }
  },

  // Verificar se usuário tem dados (para primeiro acesso)
  async checkUserData(userId) {
    try {
      if (!userId) {
        throw new Error('User ID é obrigatório');
      }

      const snapshot = await get(ref(db, `users/${userId}/data`));
      return { 
        success: true, 
        hasData: snapshot.exists(),
        data: snapshot.exists() ? snapshot.val() : null
      };
    } catch (error) {
      console.error('[FIREBASE] ❌ Erro ao verificar dados do usuário:', error);
      return { success: false, error: error.message };
    }
  }
};