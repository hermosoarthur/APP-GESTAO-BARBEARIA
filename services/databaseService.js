import { ref, set, get, update, remove, push, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../firebase-config';

export const databaseService = {
  // CRUD Genérico
  async create(collection, data) {
    try {
      const newRef = push(ref(db, collection));
      const newData = {
        ...data,
        id: newRef.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await set(newRef, newData);
      console.log(`[FIREBASE] Criado em ${collection}:`, newData);
      return { success: true, id: newRef.key, data: newData };
    } catch (error) {
      console.error(`[FIREBASE] Erro ao criar em ${collection}:`, error);
      return { success: false, error: error.message };
    }
  },

  async read(collection, filters = {}) {
    try {
      let dbRef = ref(db, collection);
      
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
        
        console.log(`[FIREBASE] Lendo ${collection}:`, filteredItems.length, 'itens');
        return { success: true, data: filteredItems };
      }
      
      console.log(`[FIREBASE] ${collection} vazia`);
      return { success: true, data: [] };
    } catch (error) {
      console.error(`[FIREBASE] Erro ao ler ${collection}:`, error);
      return { success: false, error: error.message };
    }
  },

  async update(collection, id, data) {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      await update(ref(db, `${collection}/${id}`), updateData);
      console.log(`[FIREBASE] Atualizado em ${collection}/${id}:`, updateData);
      return { success: true, data: updateData };
    } catch (error) {
      console.error(`[FIREBASE] Erro ao atualizar ${collection}/${id}:`, error);
      return { success: false, error: error.message };
    }
  },

  async delete(collection, id) {
    try {
      await remove(ref(db, `${collection}/${id}`));
      console.log(`[FIREBASE] Deletado de ${collection}/${id}`);
      return { success: true };
    } catch (error) {
      console.error(`[FIREBASE] Erro ao deletar ${collection}/${id}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Métodos específicos - VERSÃO CORRIGIDA
  async getAgendamentosByDate(date) {
    try {
      const result = await this.read('agendamentos', { field: 'data', value: date });
      return result;
    } catch (error) {
      console.error('[FIREBASE] Erro ao buscar agendamentos por data:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserByEmail(email) {
    try {
      // Método alternativo - busca todos e filtra manualmente
      const result = await this.read('users');
      
      if (result.success) {
        const user = result.data.find(u => u.email === email);
        console.log(`[FIREBASE] Usuário encontrado por email "${email}":`, user ? 'SIM' : 'NÃO');
        return { success: true, user: user || null };
      }
      
      return result;
    } catch (error) {
      console.error('[FIREBASE] Erro ao buscar usuário por email:', error);
      return { success: false, error: error.message };
    }
  },

  async getServicosMaisVendidos(periodo = 'semana') {
    try {
      // Buscar todos os agendamentos concluídos
      const agendamentosResult = await this.read('agendamentos', { field: 'status', value: 'concluido' });
      const servicosResult = await this.read('servicos');

      if (agendamentosResult.success && servicosResult.success) {
        const agendamentos = agendamentosResult.data;
        const servicos = servicosResult.data;
        
        const servicosCount = {};
        
        // Contar serviços realizados
        agendamentos.forEach(agendamento => {
          const servicoNome = agendamento.servico;
          const servico = servicos.find(s => s.nome === servicoNome);
          
          if (servico) {
            if (!servicosCount[servicoNome]) {
              servicosCount[servicoNome] = {
                nome: servicoNome,
                quantidade: 0,
                valor: 0
              };
            }
            
            servicosCount[servicoNome].quantidade += 1;
            servicosCount[servicoNome].valor += servico.preco;
          }
        });
        
        const servicosArray = Object.values(servicosCount)
          .sort((a, b) => b.quantidade - a.quantidade)
          .slice(0, 5);
        
        return { success: true, data: servicosArray };
      }
      
      return { success: true, data: [] };
    } catch (error) {
      console.error('[FIREBASE] Erro ao buscar serviços mais vendidos:', error);
      return { success: false, error: error.message };
    }
  },

  // Método para buscar funcionários ativos
  async getFuncionariosAtivos() {
    try {
      const result = await this.read('funcionarios', { field: 'status', value: 'ativo' });
      return result;
    } catch (error) {
      console.error('[FIREBASE] Erro ao buscar funcionários ativos:', error);
      return { success: false, error: error.message };
    }
  },

  // Método para criar venda quando agendamento é concluído
  async createVendaFromAgendamento(agendamento, servico) {
    try {
      const vendaData = {
        agendamentoId: agendamento.id,
        cliente: agendamento.cliente,
        servico: agendamento.servico,
        barbeiro: agendamento.barbeiro,
        valor: servico.preco,
        data: agendamento.data,
        hora: agendamento.hora,
        tipo: 'servico',
        createdAt: new Date().toISOString()
      };
      
      return await this.create('vendas', vendaData);
    } catch (error) {
      console.error('[FIREBASE] Erro ao criar venda:', error);
      return { success: false, error: error.message };
    }
  }
};