import React from 'react';

const GraficoCargo = () => {
  const colaboradores = [
    { id: 1, cargo: 'AGENTE DE REGIS...', numeroDeColaboradores: 126 },
    { id: 2, cargo: 'VENDEDOR(A)', numeroDeColaboradores: 107 },
    { id: 3, cargo: 'DIRETOR ADMINIS...', numeroDeColaboradores: 68 },
    { id: 4, cargo: 'SERVENTE DE OBR...', numeroDeColaboradores: 65 },
    { id: 5, cargo: 'DIRETOR GERAL D...', numeroDeColaboradores: 63 },
    { id: 6, cargo: 'DIRETOR', numeroDeColaboradores: 60 },
    { id: 7, cargo: 'PINTOR', numeroDeColaboradores: 57 },
    { id: 8, cargo: 'MOTORISTA', numeroDeColaboradores: 55 },
    { id: 9, cargo: 'PEDREIRO', numeroDeColaboradores: 54 },
    { id: 10, cargo: 'COITUREIRA(O) E...', numeroDeColaboradores: 53 },
    { id: 11, cargo: 'BALCONISTA', numeroDeColaboradores: 47 },
  ];

  const maxColaboradores = Math.max(...colaboradores.map(c => c.numeroDeColaboradores), 0);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      margin: '20px',
      padding: '20px',
      border: '1px solid #CBD5E0',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '1.1em',
        fontWeight: 'bold',
      }}>
        Colaboradores por Cargo
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {colaboradores.map((colaborador) => (
            <tr key={colaborador.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{
                padding: '12px 8px',
                fontSize: '0.9em',
                color: '#4A5568',
                width: '40%'
              }}>
                {colaborador.cargo}
              </td>
              <td style={{
                padding: '12px 8px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: `${(colaborador.numeroDeColaboradores / maxColaboradores) * 100}%`,
                  backgroundColor: '#68D391',
                  height: '20px',
                  borderRadius: '4px',
                  marginRight: '8px',
                  border: '1px solid #2F855A'
                }} />
                <span style={{
                  fontSize: '0.9em',
                  color: '#2D3748',
                  fontWeight: 'bold'
                }}>
                  {colaborador.numeroDeColaboradores}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GraficoCargo;
