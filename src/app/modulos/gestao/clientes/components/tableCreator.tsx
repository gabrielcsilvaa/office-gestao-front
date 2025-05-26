import { formatadorBRL, formatarCpfCnpj } from "@/utils/formatadores";
import { EmpresaVar, ListaEmpresasProps } from "../interface/interfaces";
import { formatadorSegParaHor } from "@/utils/formatadores";
import { maxValueContrato } from "../services/maxValorContrato";

import { useState } from "react";
import Modal from "./modalSocio";

function gerarIntervaloDeMeses(
  start: string | null,
  end: string | null
): string[] {
  // Verifica se start e end não são nulos ou vazios
  if (!start || !end) {
    return []; // Retorna um array vazio se qualquer uma das datas for nula ou vazia
  }

  const [startAno, startMes] = start.split("-").map(Number);
  const [endAno, endMes] = end.split("-").map(Number);

  const meses: string[] = [];
  const data = new Date(startAno, startMes - 1);

  while (
    data.getFullYear() < endAno ||
    (data.getFullYear() === endAno && data.getMonth() <= endMes - 1)
  ) {
    const mes = data
      .toLocaleString("pt-BR", { month: "short" })
      .replace(".", "");
    const ano = data.getFullYear();
    meses.push(`${mes}/${ano}`);
    data.setMonth(data.getMonth() + 1);
  }

  return meses;
}

export function ListaEmpresas({
  start_date,
  end_date,
  empresas,
}: ListaEmpresasProps) {
  const meses = gerarIntervaloDeMeses(start_date, end_date);

  function tableValues() {
    const values = [];

    // Iterando pelas empresas
    for (const item of empresas) {
      const empresaData: EmpresaVar = {
        codigo_empresa: item.codigo_empresa,
        nome_empresa: item.nome_empresa,
        cnpj: item.cnpj,
        data_cadastro: item.data_cadastro,
        data_inicio_atv: item.data_inicio_atv,
        responsavel: item.responsavel,
        faturamento: {},
        variacao_faturamento: {},
        atividades: {},
        lancamentos: item.importacoes.lancamentos ?? {},
        lancamentos_manuais: {},
        empregados: {},
        nfe_emitidas: {},
        nfe_movimentadas: {},
        faturamento_escritorio: [],
        faturamento_escritorio_total: 0,
        custo_operacional: {},
        rentabilidade: {},
      };

      // Faturamento
      let totalFaturamento = 0;
      for (const mes of meses) {
        const valor = item.faturamento?.[mes]?.[0] ?? 0;
        empresaData.faturamento[mes] = valor;
        totalFaturamento += valor;
      }
      empresaData.faturamento.total = totalFaturamento;

      // Variação do faturamento
      let mediaVariacaoFaturamento = 0;
      for (const mes of meses) {
        const variacao = item.faturamento?.[mes]?.[1] ?? "0.00%";
        empresaData.variacao_faturamento[mes] = variacao;
        const numFormatado = parseFloat(variacao.replace("%", ""));
        mediaVariacaoFaturamento += isNaN(numFormatado) ? 0 : numFormatado;
      }

      let mediaFormatada = mediaVariacaoFaturamento / meses.length;
      if (isNaN(mediaFormatada) || !isFinite(mediaFormatada)) {
        mediaFormatada = 0;
      }
      empresaData.variacao_faturamento.total = `${mediaFormatada.toFixed(2)}%`;

      // Atividades
      let totalAtividades = 0;
      for (const mes of meses) {
        const valor = item.atividades?.[mes] ?? 0;
        empresaData.atividades[mes] = valor;
        totalAtividades += valor;
      }
      empresaData.atividades.total = totalAtividades;

      // Lançamentos
      for (const mes of meses) {
        empresaData.lancamentos[mes] =
          item.importacoes?.lancamentos?.[mes] ?? 0;
      }
      empresaData.lancamentos.total = item.importacoes?.total_lancamentos ?? 0;

      // Lançamentos Manuais (%)
      for (const mes of meses) {
        const manual = item.importacoes?.lancamentos_manuais?.[mes] ?? 0;
        const normal = item.importacoes?.lancamentos?.[mes] ?? 0;
        empresaData.lancamentos_manuais[mes] =
          normal > 0 ? ((manual / normal) * 100).toFixed(2) : "0.00";
      }
      const totalManual = item.importacoes?.total_lancamentos_manuais ?? 0;
      const totalNormal = item.importacoes?.total_lancamentos ?? 0;
      empresaData.lancamentos_manuais.total =
        totalNormal > 0
          ? ((totalManual / totalNormal) * 100).toFixed(2)
          : "0.00";

      // Empregados
      let totalEmpregados = 0;
      for (const mes of meses) {
        const qtd = item.empregados?.[mes] ?? 0;
        empresaData.empregados[mes] = qtd;
        totalEmpregados += qtd;
      }
      empresaData.empregados.total = totalEmpregados;

      // NF-e emitidas
      let totalEmitidas = 0;
      for (const mes of meses) {
        const servicos = item.importacoes?.servicos?.[mes] ?? 0;
        const saidas = item.importacoes?.saidas?.[mes] ?? 0;
        const total = servicos + saidas;
        empresaData.nfe_emitidas[mes] = total;
        totalEmitidas += total;
      }

      empresaData.nfe_emitidas.total = totalEmitidas ?? 0;

      // NF-e movimentadas
      let totalMovimentadas = 0;
      for (const mes of meses) {
        const entradas = item.importacoes?.entradas?.[mes] ?? 0;
        const saidas = item.importacoes?.saidas?.[mes] ?? 0;
        const servicos = item.importacoes?.servicos?.[mes] ?? 0;
        const total = entradas + saidas + servicos;
        empresaData.nfe_movimentadas[mes] = total;
        totalMovimentadas += total;
      }
      empresaData.nfe_movimentadas.total = totalMovimentadas ?? 0;

      // Escritórios
      empresaData.faturamento_escritorio = item.escritorios ?? [];

      // Custo operacional e rentabilidade
      const custoHora = parseFloat(process.env.NEXT_PUBLIC_CUSTO_HORA || "0");
      const valorContrato = maxValueContrato(item.escritorios);
      let rentabilidadeFinal = 0;
      let custoFinal = 0;
      let faturamentoFinal = 0;
      for (const mes of meses) {
        const segundos = item.atividades?.[mes] ?? 0;
        const horas = segundos / 3600;
        const custo = parseFloat((horas * custoHora).toFixed(2));
        empresaData.custo_operacional[mes] = custo;
        empresaData.rentabilidade[mes] = (valorContrato - custo).toFixed(2);
        rentabilidadeFinal += parseFloat(empresaData.rentabilidade[mes]);
        custoFinal += custo;
        faturamentoFinal += valorContrato;
      }

      empresaData.rentabilidade.total = rentabilidadeFinal;
      empresaData.custo_operacional.total = custoFinal;
      empresaData.faturamento_escritorio_total = faturamentoFinal;

      values.push(empresaData);
    }

    return values;
  }

  const result = tableValues();

  //Modal para socios
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCodiEmp, setSelectedCodiEmp] = useState<
    string | null | number
  >(null);
  const openModalWithCodiEmp = (codiEmp: string | number) => {
    setSelectedCodiEmp(codiEmp);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="w-full space-y-4">
      {result.map((empresa, index) => (
        <div key={index}>
          <table className="table-auto min-w-[800px]">
            <thead>
              <tr>
                <th className="table-header">Razão Social</th>
                <th className="table-header">CPF/CNPJ</th>
                <th className="table-header">Data Cadastro</th>
                <th className="table-header">Data Criação</th>
                <th className="table-header">Sócio</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="table-cell">{empresa.nome_empresa}</td>
                <td className="table-cell">{formatarCpfCnpj(empresa.cnpj)}</td>
                <td className="table-cell">{empresa.data_cadastro}</td>
                <td className="table-cell">{empresa.data_inicio_atv}</td>
                <td
                  className="table-cell hover:underline cursor-pointer"
                  onClick={() => openModalWithCodiEmp(empresa.codigo_empresa)}
                >
                  {empresa.responsavel
                    ? empresa.responsavel
                    : "SEM RESPONSÁVEL"}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="max-w-[80vw] overflow-x-auto mt-4 mb-7">
            <table className="table-auto min-w-[800px]">
              <thead>
                <tr>
                  <th className="table-header"></th>
                  {meses.map((mes) => (
                    <th key={mes} className="table-header capitalize">
                      {mes}
                    </th>
                  ))}
                  <th className="table-header">Total</th>
                </tr>
              </thead>
              <tbody className="w-[280px] whitespace-nowrap">
                <tr>
                  <td className="table-cell ">Faturamento da Empresa</td>
                  {meses.map((mes, i) => {
                    const valor = empresa.faturamento?.[mes] ?? 0;
                    return (
                      <td key={i} className="table-cell">
                        {formatadorBRL.format(Number(valor))}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {formatadorBRL.format(
                      Number(empresa.faturamento.total ?? 0)
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="table-cell">Variação de Faturamento</td>
                  {meses.map((mes, i) => {
                    const valor =
                      empresa.variacao_faturamento?.[mes] ?? "0.00%";
                    return (
                      <td key={i} className="table-cell">
                        {valor}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {empresa.variacao_faturamento.total}
                  </td>
                </tr>
                <tr>
                  <td className="table-cell">Tempo Gasto no Sistema</td>
                  {meses.map((mes, i) => {
                    const valor = formatadorSegParaHor(
                      empresa.atividades?.[mes] ?? 0
                    );
                    return (
                      <td key={i} className="table-cell">
                        {valor}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {formatadorSegParaHor(empresa.atividades.total)}
                  </td>
                </tr>
                <tr>
                  <td className="table-cell">Lançamentos</td>
                  {meses.map((mes, i) => {
                    const valor = empresa.lancamentos?.[mes] ?? 0;
                    return (
                      <td key={i} className="table-cell">
                        {valor}
                      </td>
                    );
                  })}
                  <td className="table-cell">{empresa.lancamentos.total}</td>
                </tr>
                <tr>
                  <td className="table-cell">% Lançamentos Manuais</td>
                  {meses.map((mes, i) => {
                    const valor = empresa.lancamentos_manuais?.[mes] ?? 0;
                    return (
                      <td key={i} className="table-cell">
                        {`${valor}%`}{" "}
                        {/* Aqui estou usando toFixed(2) para limitar a 2 casas decimais */}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {`${empresa.lancamentos_manuais.total}%`}
                  </td>
                </tr>
                <tr>
                  <td className="table-cell">Vínculos de Folha Ativos</td>
                  {meses.map((mes, i) => {
                    const valor = empresa.empregados?.[mes] ?? 0;
                    return (
                      <td key={i} className="table-cell">
                        {valor}
                      </td>
                    );
                  })}
                  <td className="table-cell">{empresa.empregados.total}</td>
                </tr>
                <tr>
                  <td className="table-cell">Total NF-e Emitidas</td>
                  {meses.map((mes, i) => {
                    const valor = empresa.nfe_emitidas?.[mes] ?? 0;
                    return (
                      <td key={i} className="table-cell">
                        {valor}
                      </td>
                    );
                  })}
                  <td className="table-cell">{empresa.nfe_emitidas.total}</td>
                </tr>
                <tr>
                  <td className="table-cell">Total NF-e Movimentadas</td>
                  {meses.map((mes, i) => {
                    const valor = empresa.nfe_movimentadas?.[mes] ?? 0;
                    return (
                      <td key={i} className="table-cell">
                        {valor}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {empresa.nfe_movimentadas.total}
                  </td>
                </tr>
                <tr>
                  <td className="table-cell">Faturamento do Escritrio</td>
                  {meses.map((mes, i) => {
                    // Encontrar o maior valor de 'valor_contrato' entre os escritórios
                    const maiorValor = maxValueContrato(
                      empresa.faturamento_escritorio
                    );

                    return (
                      <td key={i} className="table-cell">
                        {formatadorBRL.format(maiorValor)}{" "}
                        {/* Se necessário, formate como moeda */}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {formatadorBRL.format(empresa.faturamento_escritorio_total)}
                  </td>
                </tr>
                <tr>
                  <td className="table-cell">Custo Operacional</td>
                  {meses.map((mes, i) => {
                    const valor = empresa.custo_operacional?.[mes] ?? 0;
                    return (
                      <td key={i} className="table-cell">
                        {formatadorBRL.format(Number(valor))}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {formatadorBRL.format(
                      Number(empresa.custo_operacional.total)
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="table-total">Rentabilidade Operacional</td>
                  {meses.map((mes, i) => {
                    const valor = empresa.rentabilidade?.[mes] ?? 0;
                    const valorNumerico =
                      typeof valor === "number" ? valor : parseFloat(valor); // Garantir que seja um número

                    const cor =
                      valorNumerico < 0
                        ? "text-red-600 font-bold"
                        : "text-green-600 font-bold"; // Cor condicional
                    const fundo =
                      valorNumerico < 0 ? "bg-red-100" : "bg-green-100"; // Cor condicional

                    return (
                      <td key={i} className={`table-cell ${fundo}`}>
                        <span className={`${cor}`}>
                          {formatadorBRL.format(Number(valor))}
                        </span>
                      </td>
                    );
                  })}
                  <td
                    className={
                      typeof empresa.rentabilidade.total === "number"
                        ? empresa.rentabilidade.total < 0
                          ? "table-cell bg-red-100" // Vermelho para valores negativos
                          : "table-cell bg-green-100" // Verde para valores positivos
                        : parseFloat(empresa.rentabilidade.total) < 0
                          ? "table-cell bg-red-100"
                          : "table-cell bg-green-100"
                    }
                  >
                    <span
                      className={
                        typeof empresa.rentabilidade.total === "number"
                          ? empresa.rentabilidade.total < 0
                            ? "text-red-600 font-bold " // Vermelho para valores negativos
                            : "text-green-600 font-bold" // Verde para valores positivos
                          : parseFloat(empresa.rentabilidade.total) < 0
                            ? "text-red-600 font-bold"
                            : "text-green-600 font-bold"
                      }
                    >
                      {formatadorBRL.format(
                        typeof empresa.rentabilidade.total === "number"
                          ? empresa.rentabilidade.total
                          : parseFloat(empresa.rentabilidade.total)
                      )}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        codiEmp={selectedCodiEmp}
      >
        {/* conteúdo opcional */}
      </Modal>
    </div>
  );
}
