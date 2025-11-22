import React, { useState } from "react"
import "./Cadastrar_secao.css"

function CadastrarSecao({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        descricao: "",
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        const token = JSON.parse(localStorage.getItem("userData"))?.token

        if (!token) {
            setMessage("Token não encontrado. Faça login novamente.")
            setLoading(false)
            return
        }

        try {
            const response = await fetch(
                "http://127.0.0.1:3000/secoes/cadastrar",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            )

            const data = await response.json()

            if (data.success) {
                setMessage("Seção cadastrada com sucesso!")
                setFormData({
                    descricao: "",
                })

                // Notifica o componente pai e fecha o modal
                if (onSuccess) {
                    onSuccess()
                }
            } else {
                setMessage(
                    `Erro ao cadastrar seção: ${data.message}`
                )
            }
        } catch (error) {
            setMessage(`Erro ao conectar com o servidor: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h1>Cadastro de Seção</h1>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição da seção"
                        value={formData.descricao}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>
                {message && (
                    <p
                        className={`message ${message.includes("sucesso") ? "success" : ""}`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    )
}

export default CadastrarSecao
