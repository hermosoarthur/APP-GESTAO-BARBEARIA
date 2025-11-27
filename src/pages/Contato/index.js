import { useState } from 'react'
import styles from './Contato.module.css'

export default function Contato() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Mensagem enviada!\nNome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`)
    // Futuro: integrar com EmailJS ou Firebase
  }

  return (
    <section className={styles.contato}>
      <h1>Fale Conosco</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Sua mensagem"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows="5"
          required
        />
        <button type="submit">Enviar</button>
      </form>

      <div className={styles.info}>
        <p><strong>WhatsApp:</strong> (11) 98765-4321</p>
        <p><strong>Endereço:</strong> Rua das Flores, 123 - Centro, SP</p>
      </div>
    </section>
  )
}