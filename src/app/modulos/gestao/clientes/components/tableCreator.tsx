import { formatadorBRL } from "@/utils/formatadores";
import {ListaEmpresasProps} from "../interface/interfaces"

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
  const meses = gerarIntervaloDeMeses("2024-01-01", "2024-12-31");

  return (
    <div className="space-y-4">
      {empresas.map((empresa, index) => (
        <div key={index}>
          <table className="min-w-full table-auto">
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
          <table className="min-w-full table-auto mt-4 mb-7">
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
            <tbody>
              <tr>
                <td className="table-cell">Faturamento da Empresa</td>
                {meses.map((mes, i) => {
                  const valor = empresa.faturamento?.[mes]?.[0] ?? 0;
                  return (
                    <td key={i} className="table-cell">
                      {formatadorBRL.format(Number(valor))}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="table-cell">Variação de Faturamento</td>
                <td className="table-cell">0%</td>
                <td className="table-cell">0,00%</td>
              </tr>
              <tr>
                <td className="table-cell">Tempo Gasto no Sistema</td>
                <td className="table-cell">00:32:29</td>
                <td className="table-cell">00:32:29</td>
              </tr>
              <tr>
                <td className="table-cell">Lançamentos</td>
                <td className="table-cell">0</td>
                <td className="table-cell">0</td>
              </tr>
              <tr>
                <td className="table-cell">% de Lançamentos Manuais</td>
                <td className="table-cell">0%</td>
                <td className="table-cell">0,00%</td>
              </tr>
              <tr>
                <td className="table-cell">Vínculos de Folhas Ativos</td>
                <td className="table-cell">0</td>
                <td className="table-cell">0</td>
              </tr>
              <tr>
                <td className="table-cell">Notas Fiscais Emitidas</td>
                <td className="table-cell">0</td>
                <td className="table-cell">0</td>
              </tr>
              <tr>
                <td className="table-cell">
                  Total de Notas Fiscais Movimentadas
                </td>
                <td className="table-cell">0</td>
                <td className="table-cell">0</td>
              </tr>
              <tr>
                <td className="table-cell">Faturamento do Escritório</td>
                <td className="table-cell">R$ 705,00</td>
                <td className="table-cell">R$ 705,00</td>
              </tr>
              <tr>
                <td className="table-cell">Custo Operacional</td>
                <td className="table-cell">R$ 10,83</td>
                <td className="table-cell">R$ 10,83</td>
              </tr>
              <tr>
                <td className="table-total">Rentabilidade Operacional</td>
                <td className="table-total">R$ 694,80</td>
                <td className="table-total">R$ 694,80</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
