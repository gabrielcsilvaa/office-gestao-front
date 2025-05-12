

interface Empresa {
  id: number;
  nome_empresa: string;
  regime_tributario: string;
  cnpj: string;
  data_cadastro: string;
  responsavel_legal: string;
  data_inatividade: string;

}

const formatCNPJ = (cnpj: string) => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

export default function ListaEmpresasRegimeTributario({ dados }: { dados: Empresa[] }) {
  console.log("adsfasgfmasgaskmgasmgas", dados)
  return (
    <div className="flex flex-col gap-4 overflow-x-auto max-h-[700px] w-full">
      <table className="w-full border border-gray-300 text-sm font-cairo">
        <thead>
          <tr className="bg-gray-200 border-b border-gray-400">
            <th className="px-4 py-2 border-r">#</th>
            <th className="px-4 py-2 cursor-pointer border-r">Nome</th>
            <th className="px-4 py-2 cursor-pointer border-r">Regime</th>
            <th className="px-4 py-2">CNPJ</th>
            <th className="px-4 py-2">Cadastro</th>
            <th className="px-4 py-2">Inatividade</th>
            <th className="px-4 py-2">Responsavel</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {dados.map((empresa, index) => (
            <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b border-gray-300`}>
              <td className="px-4 py-2">{index}</td>
              <td className="px-4 py-2">{empresa.nome_empresa}</td>
              <td className="px-4 py-2">{empresa.regime_tributario}</td>
              <td className="px-4 py-2">{empresa.cnpj}</td>
              <td className="px-4 py-2">{empresa.data_cadastro}</td>
              <td className="px-4 py-2">{empresa.data_inatividade}</td>
              <td className="px-4 py-2">{empresa.responsavel_legal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

