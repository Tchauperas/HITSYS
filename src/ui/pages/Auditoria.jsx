import React, { useEffect, useState } from "react"
import "./Auditoria.css"
import Navbar from "../components/Navbar"
import logo from "../assets/auditoria_icon.png"

function Auditoria() {
    const [auditorias, setAuditorias] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    const fetchAuditorias = async () => {
        const token = JSON.parse(localStorage.getItem("userData"))?.token

        if (!token) {
            console.error("Token não encontrado no localStorage.")
            setLoading(false)
            return
        }

        try {
            const response = await fetch(
                "http://127.0.0.1:3000/auditoria/visualizar",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (data.success && Array.isArray(data.values)) {
                const ordenado = data.values.sort(
                    (a, b) => new Date(b.data_hora) - new Date(a.data_hora)
                )
                setAuditorias(ordenado)
            } else {
                console.error("Formato inesperado:", data)
            }
        } catch (error) {
            console.error("Erro no fetch:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAuditorias()
    }, [])

    const formatDateTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    }

    const filteredAuditorias = auditorias.filter(
        (auditoria) =>
            auditoria.descricao_acao
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            auditoria.nome_usuario.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="auditoria-container">
            <Navbar />

            <div className="content">
                <header className="top-row">
                    <div className="title">
                        <img src={logo} alt="Logo" className="logo" />
                        <h1>Listagem de Auditoria</h1>
                    </div>
                </header>

                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="   Pesquisar auditoria"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        Carregando auditorias...
                    </p>
                ) : filteredAuditorias.length === 0 ? (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        Nenhuma auditoria encontrada.
                    </p>
                ) : (
                    <div className="auditoria-table-container">
                        <table className="auditoria-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Data/Hora</th>
                                    <th>Usuário</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAuditorias.map((auditoria) => (
                                    <tr key={auditoria.id_auditoria}>
                                        <td>{auditoria.id_auditoria}</td>
                                        <td>
                                            {formatDateTime(
                                                auditoria.data_hora
                                            )}
                                        </td>
                                        <td>{auditoria.nome_usuario}</td>
                                        <td>{auditoria.descricao_acao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Auditoria
