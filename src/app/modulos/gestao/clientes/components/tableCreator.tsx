import { formatadorBRL } from "@/utils/formatadores";
import { EmpresaVar, ListaEmpresasProps } from "../interface/interfaces";
import { formatadorSegParaHor } from "@/utils/formatadores";

function gerarIntervaloDeMeses(start: string, end: string): string[] {
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
    meses.push(`${mes}/${ano}`); // <<-- mudou aqui
    data.setMonth(data.getMonth() + 1);
  }

  return meses;
}

export function ListaEmpresas({ empresas }: ListaEmpresasProps) {
  const meses = gerarIntervaloDeMeses("2024-01-01", "2024-05-31");

  function tableValues() {
    const values = [];

    // Iterando pelas empresas
    for (const item of empresas) {
      const empresaData: EmpresaVar = {
        nome_empresa: item.nome_empresa,
        cnpj: item.cnpj,
        data_cadastro: item.data_cadastro,
        data_inicio_atv: item.data_inicio_atv,
        responsavel: item.responsavel,
        faturamento: {},
        variacao_faturamento: {},
        atividades: {},
        
      };

      // Faturamento
      let totalFaturamento = 0;
      for (const mes of Object.keys(item.faturamento)) {
        empresaData.faturamento[mes] = item.faturamento[mes][0];
        totalFaturamento += item.faturamento[mes][0];
      }
      empresaData.faturamento.total = totalFaturamento;

      // Variação do faturamento
      let mediaVariacaoFaturamento = 0;
      for (const mes of Object.keys(item.faturamento)) {
        empresaData.variacao_faturamento[mes] = item.faturamento[mes][1];

        const numFormatado = parseFloat(
          item.faturamento[mes][1].replace("%", "")
        );
        mediaVariacaoFaturamento += numFormatado;
      }

      // Calculando a média e verificando se é NaN ou Infinity
      let mediaFormatada =
        mediaVariacaoFaturamento / Object.keys(item.faturamento).length;
      if (isNaN(mediaFormatada) || !isFinite(mediaFormatada)) {
        mediaFormatada = 0; // Se for NaN ou Infinity, setamos a média como 0
      }
      empresaData.variacao_faturamento.total = `${mediaFormatada.toFixed(2)}%`;


      //Atividades

      // Adiciona o objeto da empresa à lista de valores
      values.push(empresaData);
    }

    return values;
  }

  const result = tableValues();
  console.log(result);
  return (
    <div className="w-full space-y-4">
      {empresas.map((empresa, index) => (
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
                <td className="table-cell">{empresa.cnpj}</td>
                <td className="table-cell">{empresa.data_cadastro}</td>
                <td className="table-cell">{empresa.data_inicio_atv}</td>
                <td className="table-cell">{empresa.responsavel}</td>
              </tr>
            </tbody>
          </table>
          <div className="max-w-[1100px] overflow-x-auto mt-4 mb-7">
            <table className="table-auto min-w-[800px]">
              <thead>
                <tr>
                  <th className="table-header"></th>
                  <th className="table-header"></th>
                  {meses.map((mes) => (
                    <th key={mes} className="table-header capitalize">
                      {mes}
                    </th>
                  ))}
                  <th className="table-header">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="table-cell " colSpan={2}>
                    Faturamento da Empresa
                  </td>
                  {meses.map((mes, i) => {
                    const valor = empresa.faturamento?.[mes]?.[0] ?? 0;
                    return (
                      <td key={i} className="table-cell">
                        {formatadorBRL.format(Number(valor))}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {formatadorBRL.format(
                      meses.reduce((total, mes) => {
                        const valor = empresa.faturamento?.[mes]?.[0] ?? 0;
                        return total + valor;
                      }, 0) // Inicializa a soma com 0
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="table-cell" colSpan={2}>
                    Variação de Faturamento
                  </td>
                  {meses.map((mes, i) => {
                    const valor = empresa.faturamento?.[mes]?.[1] ?? "0.00%";
                    return (
                      <td key={i} className="table-cell">
                        {valor}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {`${meses
                      .map((mes) => {
                        // Remove o '%' e converte para número, tratando valores nulos ou inválidos como 0
                        const valor =
                          empresa.faturamento?.[mes]?.[1] ?? "0.00%";
                        return parseFloat(valor.replace("%", "")) || 0;
                      })
                      .reduce((total, valor) => total + valor, 0)
                      .toFixed(2)}%`}{" "}
                    {/* Arredondando para 2 casas decimais */}
                  </td>
                </tr>
                <tr>
                  <td className="table-cell" colSpan={2}>
                    Tempo Gasto no Sistema
                  </td>
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
                    {formatadorSegParaHor(
                      meses.reduce((total, mes) => {
                        const valor = empresa.atividades?.[mes] ?? 0;
                        return total + valor;
                      }, 0) // Inicializa a soma com 0
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="table-cell" colSpan={2}>
                    Lançamentos
                  </td>
                  {meses.map((mes, i) => {
                    const valor = empresa.importacoes.lancamentos?.[mes] ?? 0;
                    return (
                      <td key={i} className="table-cell">
                        {valor}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {
                      meses.reduce((total, mes) => {
                        const valor =
                          empresa.importacoes.lancamentos?.[mes] ?? 0;
                        return total + valor;
                      }, 0) // Inicializa a soma com 0
                    }
                  </td>
                </tr>
                <tr>
                  <td className="table-cell" colSpan={2}>
                    % Lançamentos Manuais
                  </td>
                  {meses.map((mes, i) => {
                    const lancamentos =
                      empresa.importacoes.lancamentos?.[mes] ?? 0;
                    const lancamentosManuais =
                      empresa.importacoes.lancamentos_manuais?.[mes] ?? 0;

                    // Evitar divisão por zero
                    const valor =
                      lancamentos === 0
                        ? 0
                        : (lancamentosManuais / lancamentos) * 100;

                    return (
                      <td key={i} className="table-cell">
                        {`${valor.toFixed(2)}%`}{" "}
                        {/* Aqui estou usando toFixed(2) para limitar a 2 casas decimais */}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {
                      meses.reduce((total, mes) => {
                        const lancamentos =
                          empresa.importacoes.lancamentos?.[mes] ?? 0;
                        const lancamentosManuais =
                          empresa.importacoes.lancamentos_manuais?.[mes] ?? 0;

                        return total + (lancamentos / lancamentosManuais) * 100;
                      }, 0) // Inicializa a soma com 0
                    }
                  </td>
                </tr>
                <tr>
                  <td className="table-cell" colSpan={2}>
                    Vínculos de Folha Ativos
                  </td>
                  {meses.map((mes, i) => {
                    const valor = empresa.empregados?.[mes] ?? 0;
                    return (
                      <td key={i} className="table-cell">
                        {valor}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {
                      meses.reduce((total, mes) => {
                        const valor = empresa.empregados?.[mes] ?? 0;
                        return total + valor;
                      }, 0) // Inicializa a soma com 0
                    }
                  </td>
                </tr>
                <tr>
                  <td className="table-cell" colSpan={2}>
                    Total NF-e Emitidas
                  </td>
                  {meses.map((mes, i) => {
                    const valor =
                      (empresa.importacoes.saidas?.[mes] ?? 0) +
                      (empresa.importacoes.servicos?.[mes] ?? 0);
                    return (
                      <td key={i} className="table-cell">
                        {valor}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {
                      meses.reduce((total, mes) => {
                        const valor =
                          (empresa.importacoes.saidas?.[mes] ?? 0) +
                          (empresa.importacoes.servicos?.[mes] ?? 0);
                        return total + valor;
                      }, 0) // Inicializa a soma com 0
                    }
                  </td>
                </tr>
                <tr>
                  <td className="table-cell" colSpan={2}>
                    Total NF-e Movimentadas
                  </td>
                  {meses.map((mes, i) => {
                    const valor =
                      (empresa.importacoes.saidas?.[mes] ?? 0) +
                      (empresa.importacoes.servicos?.[mes] ?? 0) +
                      (empresa.importacoes.entradas?.[mes] ?? 0);
                    return (
                      <td key={i} className="table-cell">
                        {valor}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {
                      meses.reduce((total, mes) => {
                        const valor =
                          (empresa.importacoes.saidas?.[mes] ?? 0) +
                          (empresa.importacoes.servicos?.[mes] ?? 0) +
                          (empresa.importacoes.entradas?.[mes] ?? 0);
                        return total + valor;
                      }, 0) // Inicializa a soma com 0
                    }
                  </td>
                </tr>
                <tr>
                  <td className="table-cell" colSpan={2}>
                    Faturamento do Escritrio
                  </td>
                  {meses.map((mes, i) => {
                    // Encontrar o maior valor de 'valor_contrato' entre os escritórios
                    const maiorValor = Math.max(
                      ...empresa.escritorios.map(
                        (escritorio) => Number(escritorio.valor_contrato) || 0
                      )
                    );

                    return (
                      <td key={i} className="table-cell">
                        {formatadorBRL.format(maiorValor)}{" "}
                        {/* Se necessário, formate como moeda */}
                      </td>
                    );
                  })}
                  <td className="table-cell">
                    {formatadorBRL.format(
                      meses.reduce((total) => {
                        // Calcula o maior valor de cada escritório para cada mês
                        const maiorValorDoMes = Math.max(
                          ...empresa.escritorios.map(
                            (escritorio) =>
                              Number(escritorio.valor_contrato) || 0
                          )
                        );

                        // Acumula o maior valor do mês
                        return total + maiorValorDoMes;
                      }, 0) // Inicializa a soma com 0
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="table-cell" colSpan={2}>
                    Custo Operacional
                  </td>
                  {meses.map((mes, i) => {
                    // Encontrar o maior valor de 'valor_contrato' entre os escritórios
                    const maiorValor = Math.max(
                      ...empresa.escritorios.map(
                        (escritorio) => Number(escritorio.valor_contrato) || 0
                      )
                    );

                    return (
                      <td key={i} className="table-cell">
                        {formatadorBRL.format(maiorValor)}{" "}
                        {/* Se necessário, formate como moeda */}
                      </td>
                    );
                  })}
                  <td className="table-cell">-</td>
                </tr>
                <tr>
                  <td className="table-total" colSpan={2}>
                    Rentabilidade Operacional
                  </td>
                  <td className="table-total">R$ 694,80</td>
                  <td className="table-total">R$ 694,80</td>
                  <td className="table-cell">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
