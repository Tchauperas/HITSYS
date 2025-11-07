import React, { useEffect, useState } from "react"
import "./Empresas.css"
import Navbar from "../components/Navbar"
import CadastroEmpresa from "../components/Cadastro_empresa"
import AlterarEmpresa from "../components/Alterar_empresa" // Importa o componente de alteração
import logo from "../assets/empresas_icon.png"

function Empresas() {
    const [empresas, setEmpresas] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [showCadastroModal, setShowCadastroModal] = useState(false)
    const [showAlterarModal, setShowAlterarModal] = useState(false)
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null)

    const fetchEmpresas = async () => {
        const token = JSON.parse(localStorage.getItem("userData"))?.token

        if (!token) {
            console.error("Token não encontrado no localStorage.")
            setLoading(false)
            return
        }

        try {
            const response = await fetch(
                "http://127.0.0.1:3000/empresas/visualizar",
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
                setEmpresas(data.values)
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
        fetchEmpresas()
    }, [])

    const handleSuccess = () => {
        setTimeout(() => {
            setShowCadastroModal(false)
            setShowAlterarModal(false)
            fetchEmpresas()
        }, 1000)
    }

    const handleDelete = async (idEmpresa) => {
        const token = JSON.parse(localStorage.getItem("userData"))?.token

        if (!token) {
            console.error("Token não encontrado no localStorage.")
            return
        }

        if (window.confirm("Tem certeza que deseja excluir esta empresa?")) {
            try {
                const response = await fetch(
                    `http://127.0.0.1:3000/empresas/deletar/${idEmpresa}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                // Tenta interpretar a resposta como JSON
                if (
                    response.headers
                        .get("Content-Type")
                        ?.includes("application/json")
                ) {
                    const data = await response.json()

                    if (data.success) {
                        alert("Empresa excluída com sucesso!")
                        fetchEmpresas() // Atualiza a lista de empresas
                    } else {
                        console.error("Erro ao excluir empresa:", data.message)
                        alert("Erro ao excluir empresa.")
                    }
                } else {
                    // Caso a resposta não seja JSON
                    const text = await response.text()
                    console.error("Resposta inesperada da API:", text)
                    alert("Erro inesperado ao excluir empresa.")
                }
            } catch (error) {
                console.error("Erro no fetch:", error)
                alert("Erro ao excluir empresa.")
            }
        }
    }

    const filteredEmpresas = empresas.filter(
        (empresa) =>
            empresa.razao_social.toLowerCase().includes(search.toLowerCase()) ||
            empresa.nome_fantasia
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            empresa.cnpj.includes(search)
    )

    return (
        <div className="empresas-container">
            <Navbar />

            <div className="content">
                <header className="top-row">
                    <div className="title">
                        <img src={logo} alt="Logo" className="logo" />
                        <h1>Listagem de Empresas</h1>
                    </div>

                    <div className="right-actions">
                        <button
                            className="btn-cadastrar"
                            onClick={() => setShowCadastroModal(true)}
                        >
                            Cadastrar
                        </button>
                    </div>
                </header>

                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="   Pesquisar empresa"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        Carregando empresas...
                    </p>
                ) : filteredEmpresas.length === 0 ? (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        Nenhuma empresa encontrada.
                    </p>
                ) : (
                    <table className="empresas-table">
                        <thead>
                            <tr>
                                <th>Nome Fantasia</th>
                                <th>Razão Social</th>
                                <th>CNPJ</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmpresas.map((empresa) => (
                                <tr key={empresa.id_empresa}>
                                    <td>{empresa.nome_fantasia}</td>
                                    <td>{empresa.razao_social}</td>
                                    <td>
                                        {empresa.cnpj.replace(
                                            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                                            "$1.$2.$3/$4-$5"
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn-editar"
                                            onClick={() => {
                                                setEmpresaSelecionada(empresa)
                                                setShowAlterarModal(true)
                                            }}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-excluir"
                                            onClick={() =>
                                                handleDelete(empresa.id_empresa)
                                            }
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCadastroModal && (
                <CadastroEmpresa
                    onClose={() => setShowCadastroModal(false)}
                    onSuccess={handleSuccess}
                />
            )}

            {showAlterarModal && empresaSelecionada && (
                <AlterarEmpresa
                    empresa={empresaSelecionada}
                    onClose={() => setShowAlterarModal(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    )
}

export default Empresas
