// src/components/Modal/index.js
import styles from './Modal.module.css'

export default function Modal({ membro, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.fechar} onClick={onClose}>×</button>
        
        <img src={membro.imagem} alt={membro.nome} className={styles.imagem} />
        
        <div className={styles.conteudo}>
          <h2>{membro.nome}</h2>
          <p className={styles.funcao}>{membro.funcao}</p>
          <p className={styles.descricao}>{membro.descricao}</p>
          
          <button className={styles.botaoAgendar}>
            Agendar com {membro.nome.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  )
}