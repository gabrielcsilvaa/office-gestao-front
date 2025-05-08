type Empresa = {
  nome_empresa: string;
  cnpj: string;
  responsavel: string | null;
  data_cadastro: string;
  data_inicio_atv: string;
};

type ListaEmpresasProps = {
  empresas: Empresa[];
};

export function ListaEmpresas({ empresas }: ListaEmpresasProps) {
  return (
    <div className="space-y-4">
      {empresas.map((empresa, index) => (
        <table key={index} className="min-w-full table-auto">
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
      ))}
    </div>
  );
}
