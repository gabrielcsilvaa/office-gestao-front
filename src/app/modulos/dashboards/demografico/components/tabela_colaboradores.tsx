// components/TabelaColaboradores.tsx
export default function TabelaColaboradores() {
  const colaboradores = [
    { nome: "JOSE ORLANDO QUEIROZ", departamento: "GERAL", centroCusto: "GERAL" },
    { nome: "MARIA REGINALDA ROGÉRIO DE ALMEIDA", departamento: "FILIAL 2", centroCusto: "1" },
    { nome: "BRUNO DE SOUZA SIERRA", departamento: "FILIAL 4", centroCusto: "1" },
    { nome: "MARIA APARECIDA CALIXTO", departamento: "MATRIZ", centroCusto: "MATRIZ" },
    { nome: "MARIA ELSANGELA DE LEMOS BARBOSA", departamento: "PRODUÇÃO", centroCusto: "GERAL" },
    { nome: "FRANCISCO TAO BEZERRA DO NASCIMENTO", departamento: "MATRIZ", centroCusto: "1" },
    { nome: "MARIA DE FATIMA HOLANDA DOS SANTOS SILVA", departamento: "PARC", centroCusto: "PARC" },
    { nome: "JONES NOGUEIRA DE ANDRADE SILVA", departamento: "DEPARTAMENTO GERAL", centroCusto: "GERAL" },
    { nome: "FRANCISCO ANTONIO VIANA", departamento: "DEPARTAMENTO GERAL", centroCusto: "1" },
    { nome: "JOSE CARLOS BARBOSA DA SILVA", departamento: "GERAL", centroCusto: "1" },
    { nome: "FRANCISCO EVANDRO FRANCELINO DE NEGREIROS", departamento: "ADMINISTRATIVO", centroCusto: "GERAL" },
    { nome: "ANTONIO CARLOS BEZERRA DA SILVA", departamento: "OFFICE BING.LABS", centroCusto: "DIRETORIA" },
    { nome: "MARIA ZULEIDE EUFRÁSIO BRAGA", departamento: "FILIAL 2 - DEL PASCO", centroCusto: "GERAL" },
    { nome: "FRANCISCO ORLANDO SILVEIRA PEREIRA", departamento: "PARC", centroCusto: "PARC" },
    { nome: "MARIA APARECIDA DA SILVA ALMEIDA", departamento: "PARC", centroCusto: "1" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md max-h-[400px] overflow-auto border border-gray-200">
      <table className="min-w-full text-sm font-medium text-gray-800">
        <thead className="sticky top-0 z-10 bg-black text-white">
          <tr>
            <th className="py-3 px-4 text-left">NOME</th>
            <th className="py-3 px-4 text-left">DEPARTAMENTO</th>
            <th className="py-3 px-4 text-left">CENTRO DE CUSTO</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.map((colab, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b`}
            >
              <td className="py-2 px-4">{colab.nome}</td>
              <td className="py-2 px-4">{colab.departamento}</td>
              <td className="py-2 px-4">{colab.centroCusto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
